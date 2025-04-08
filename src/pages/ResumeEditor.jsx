import React, { useState, useEffect, useCallback } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // import styles
import {
  Box,
  Button,
  Spinner,
  Alert,
  AlertIcon,
  Heading,
  Text,
  VStack,
  HStack,
  Tag,
  useToast,
  Center,
} from '@chakra-ui/react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_URL, API_ENDPOINTS } from '../config/api';
import { useParams } from 'react-router-dom';

const ResumeEditor = () => {
  const { id } = useParams();
  const [editorHtml, setEditorHtml] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [jobDescriptionExists, setJobDescriptionExists] = useState(false);
  const { user, token } = useAuth();
  const toast = useToast();

  const fetchData = useCallback(async () => {
    if (!id || !token) return;
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    try {
      const [resumeRes, textRes] = await Promise.all([
        axios.get(API_ENDPOINTS.resumes.getSingleResume(id), {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(API_ENDPOINTS.resumes.getResumeText(id), {
          headers: { Authorization: `Bearer ${token}` },
        })
      ]);

      setJobDescriptionExists(!!resumeRes.data.jobDescription);
      setEditorHtml(textRes.data.text || '');
    } catch (err) {
      console.error('Error fetching resume data/text:', err);
      setError('Failed to load resume data.');
      toast({
        title: 'Error',
        description: 'Could not load resume data.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [id, token, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSaveText = async () => {
    if (!id || !token) return;
    setIsSaving(true);
    setError(null);
    try {
      await axios.put(
        API_ENDPOINTS.resumes.saveResumeText(id),
        { editedText: editorHtml },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      toast({
        title: 'Success',
        description: 'Resume text saved successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error('Error saving resume text:', err);
      setError('Failed to save resume text.');
      toast({
        title: 'Error',
        description: 'Could not save resume text.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAnalyzeChanges = async () => {
    if (!id || !token) return;
    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);
    try {
      const plainText = new DOMParser().parseFromString(editorHtml, 'text/html').body.textContent || "";

      const response = await axios.post(
        API_ENDPOINTS.resumes.analyzeChanges(id),
        { editedResumeText: plainText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setAnalysisResult(response.data);
      toast({
        title: 'Analysis Complete',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error('Error analyzing changes:', err);
      const errorMsg = err.response?.data?.error || 'Failed to analyze changes.';
      setError(errorMsg);
      if (err.response?.data?.ppuClicksRemaining === 0) {
        console.log("Analysis failed: No PPU clicks remaining.");
      }
      toast({
        title: 'Analysis Failed',
        description: errorMsg,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
      [{size: []}],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'},
       {'indent': '-1'}, {'indent': '+1'}],
      ['link'],
      ['clean']
    ],
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link'
  ];

  if (isLoading) {
    return (
      <Center h="400px">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Box p={4}>
      <Heading size="lg" mb={4}>Edit Resume</Heading>
      {error && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}

      <Box mb={6} h="400px">
        <ReactQuill
          theme="snow"
          value={editorHtml}
          onChange={setEditorHtml}
          modules={modules}
          formats={formats}
          style={{ height: '100%' }}
          readOnly={isSaving || isAnalyzing}
        />
      </Box>

      <HStack spacing={4}>
        <Button
            onClick={handleSaveText}
            isLoading={isSaving}
            colorScheme="blue"
            isDisabled={isAnalyzing}
        >
            Save Text
        </Button>
        <Button
            onClick={handleAnalyzeChanges}
            isLoading={isAnalyzing}
            colorScheme="green"
            isDisabled={!jobDescriptionExists || isSaving}
            title={!jobDescriptionExists ? "Add a Job Description on the dashboard first to enable analysis" : ""}
        >
            Analyze Changes {user?.subscriptionStatus !== 'premium' && '(Uses 1 Click)'}
        </Button>
      </HStack>

      {isAnalyzing && <Spinner mt={4} />}

      {analysisResult && (
        <Box mt={6} p={4} borderWidth="1px" borderRadius="md" borderColor="gray.200">
          <Heading size="md" mb={3}>Analysis Results</Heading>
          <Text mb={1}><b>Optimization Score:</b> {analysisResult.optimizationScore?.toFixed(1) ?? 'N/A'} / 100</Text>
           {analysisResult.ppuClicksRemaining !== null && analysisResult.ppuClicksRemaining !== undefined && (
             <Text mb={3} fontSize="sm" color="blue.500">
               (PPU Clicks Remaining for this Optimization: {analysisResult.ppuClicksRemaining})
             </Text>
           )}

          <Box mb={3}>
            <Heading size="sm" mb={1}>Matched Keywords:</Heading>
            {analysisResult.keywordAnalysis?.matchedKeywords?.length > 0 ? (
              <HStack wrap="wrap" spacing={2}>
                {analysisResult.keywordAnalysis.matchedKeywords.map((kw, i) => <Tag key={i} colorScheme="green" size="md">{kw}</Tag>)}
              </HStack>
            ) : (<Text fontSize="sm">None found.</Text>)}
          </Box>

          <Box mb={3}>
            <Heading size="sm" mb={1}>Missing Keywords:</Heading>
             {analysisResult.keywordAnalysis?.missingKeywords?.length > 0 ? (
              <HStack wrap="wrap" spacing={2}>
                {analysisResult.keywordAnalysis.missingKeywords.map((kw, i) => <Tag key={i} colorScheme="red" size="md">{kw}</Tag>)}
              </HStack>
            ) : (<Text fontSize="sm">None missing!</Text>)}
          </Box>

          <Box>
            <Heading size="sm" mb={1}>Suggestions:</Heading>
            {analysisResult.suggestions?.length > 0 ? (
               <VStack align="start" spacing={1}>
                {analysisResult.suggestions.map((s, i) => <Text key={i} fontSize="sm">- {s}</Text>)}
              </VStack>
            ) : (<Text fontSize="sm">No specific suggestions.</Text>)}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ResumeEditor;
