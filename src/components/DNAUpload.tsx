"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dna, Upload, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface DNAUploadProps {
  userId: string;
  onUploadSuccess?: (profileId: string) => void;
}

interface Trait {
  id: string;
  category: string;
  name: string;
  value: string;
  label: string;
  riskLevel: string;
}

export default function DNAUpload({ userId, onUploadSuccess }: DNAUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadMessage, setUploadMessage] = useState('');
  const [traits, setTraits] = useState<Trait[]>([]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadStatus('uploading');
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('dnaFile', file);
      formData.append('userId', userId);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch('/api/dna/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const result = await response.json();

      if (result.success) {
        setUploadStatus('success');
        setUploadMessage(`Successfully processed ${result.traits} genetic traits`);
        
        // Fetch the traits
        await fetchTraits(userId);
        
        if (onUploadSuccess) {
          onUploadSuccess(result.profileId);
        }
      } else {
        setUploadStatus('error');
        setUploadMessage(result.error || 'Upload failed');
      }
    } catch (error) {
      setUploadStatus('error');
      setUploadMessage('Network error during upload');
    } finally {
      setUploading(false);
    }
  };

  const fetchTraits = async (uid: string) => {
    try {
      const response = await fetch(`/api/dna/profile/${uid}`);
      const result = await response.json();
      
      if (result.success) {
        setTraits(result.profile.traits);
      }
    } catch (error) {
      console.error('Error fetching traits:', error);
    }
  };

  const getRiskBadgeVariant = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'default';
      default: return 'outline';
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Dna className="h-5 w-5" />
            <span>Upload DNA File</span>
          </CardTitle>
          <CardDescription>
            Upload your raw DNA data file (23andMe, AncestryDNA, etc.) to discover your genetic traits
          </CardDescription>
        </CardHeader>
        <CardContent>
          {uploadStatus === 'idle' && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">Upload Your DNA File</h3>
              <p className="text-gray-500 mb-4">
                Supported formats: .txt, .csv (raw DNA data files)
              </p>
              <input
                type="file"
                accept=".txt,.csv"
                onChange={handleFileUpload}
                className="hidden"
                id="dna-upload"
                disabled={uploading}
              />
              <label htmlFor="dna-upload">
                <Button asChild>
                  <span>Choose File</span>
                </Button>
              </label>
            </div>
          )}

          {uploadStatus === 'uploading' && (
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Processing your DNA file...</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-sm text-center text-gray-500">
                This may take a few moments as we analyze your genetic data
              </p>
            </div>
          )}

          {uploadStatus === 'success' && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{uploadMessage}</AlertDescription>
            </Alert>
          )}

          {uploadStatus === 'error' && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{uploadMessage}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Traits Display */}
      {traits.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Genetic Traits</CardTitle>
            <CardDescription>
              Key insights from your DNA analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {traits.map((trait) => (
                <div key={trait.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{trait.label}</h4>
                    <Badge variant={getRiskBadgeVariant(trait.riskLevel)}>
                      {trait.riskLevel.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Category:</span> {trait.category}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Value:</span> 
                      <span className={`ml-1 ${getRiskColor(trait.riskLevel)}`}>
                        {trait.value}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}