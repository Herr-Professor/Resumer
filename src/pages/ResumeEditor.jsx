import React, { useState, useEffect, useCallback } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // import styles
import {
  Box,
  Button,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Heading,
  Text,
  VStack,
  HStack,
  Tag,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Assuming AuthContext provides token
import apiConfig from '../config/api'; // Assuming apiConfig provides backend URL

const API_BASE_URL = apiConfig.baseURL; // Adjust if your config is different

const ResumeEditor = ({ resumeId, jobDescriptionExists }) => {
  const [editorHtml, setEditorHtml] = useState('');
  const [isLoadingText, setIsLoadingText] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const { token } = useAuth();
  const toast = useToast();

  const fetchText = useCallback(async () => {
    if (!resumeId || !token) return;
    setIsLoadingText(true);
    setError(null);
    setAnalysisResult(null); // Clear previous analysis on text fetch
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/resumes/${resumeId}/text`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Quill expects HTML string or Delta object. Backend sends plain text.
      // For now, wrap in <p> or handle Delta conversion if backend changes.
      // Simple approach: treat as plain text and let Quill handle it.
      setEditorHtml(response.data.text || '');
    } catch (err) {
      console.error('Error fetching resume text:', err);
      setError('Failed to load resume text.');
      toast({
        title: 'Error',
        description: 'Could not load resume text.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoadingText(false);
    }
  }, [resumeId, token, toast]);

  useEffect(() => {
    fetchText();
  }, [fetchText]);

  const handleSaveText = async () => {
    if (!resumeId || !token) return;
    setIsSaving(true);
    setError(null);
    try {
      await axios.put(
        `${API_BASE_URL}/api/resumes/${resumeId}/text`,
        { editedText: editorHtml }, // Send HTML content
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
    if (!resumeId || !token) return;
    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);
    try {
      // Extract plain text from HTML for analysis if needed by backend
      // This is a basic extraction, might need refinement
      const plainText = new DOMParser().parseFromString(editorHtml, 'text/html').body.textContent || "";

      const response = await axios.post(
        `${API_BASE_URL}/api/resumes/${resumeId}/analyze-changes`,
        { editedResumeText: plainText }, // Send plain text
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

  // Quill modules and formats can be customized if needed
  const modules = {
    toolbar: [
      [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
      [{size: []}],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'},
       {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image', 'video'], // Consider removing image/video if not applicable
      ['clean']
    ],
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
  ];


  return (
    <Box>
      {isLoadingText && <Spinner />}
      {error && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}

      <ReactQuill
        theme="snow"
        value={editorHtml}
        onChange={setEditorHtml}
        modules={modules}
        formats={formats}
        style={{ height: '400px', marginBottom: '50px' }} // Adjust height as needed
        readOnly={isLoadingText}
      />

      <HStack mt={10} spacing={4}>
        <Button
            onClick={handleSaveText}
            isLoading={isSaving}
            colorScheme="blue"
            isDisabled={isLoadingText}
        >
            Save Text
        </Button>
        <Button
            onClick={handleAnalyzeChanges}
            isLoading={isAnalyzing}
            colorScheme="green"
            isDisabled={isLoadingText || !jobDescriptionExists || isSaving} // Disable if no JD or currently saving
            title={!jobDescriptionExists ? "Add a Job Description first to enable analysis" : ""}
        >
            Analyze Changes
        </Button>
      </HStack>

      {isAnalyzing && <Spinner mt={4} />}

      {analysisResult && (
        <Box mt={6} p={4} borderWidth="1px" borderRadius="md" borderColor="gray.200">
          <Heading size="md" mb={3}>Analysis Results</Heading>
          <Text mb={1}><b>Optimization Score:</b> {analysisResult.optimizationScore?.toFixed(1) ?? 'N/A'} / 10</Text>
           {analysisResult.ppuClicksRemaining !== undefined && (
             <Text mb={3} fontSize="sm" color="blue.500">
               (PPU Clicks Remaining for this Optimization: {analysisResult.ppuClicksRemaining})
             </Text>
           )}

          <Box mb={3}>
            <Heading size="sm" mb={1}>Matched Keywords:</Heading>
            {analysisResult.keywordAnalysis?.matchedKeywords?.length > 0 ? (
              <HStack wrap="wrap">
                {analysisResult.keywordAnalysis.matchedKeywords.map((kw, i) => <Tag key={i} colorScheme="green">{kw}</Tag>)}
              </HStack>
            ) : (<Text fontSize="sm">None found.</Text>)}
          </Box>

          <Box mb={3}>
            <Heading size="sm" mb={1}>Missing Keywords:</Heading>
             {analysisResult.keywordAnalysis?.missingKeywords?.length > 0 ? (
              <HStack wrap="wrap">
                {analysisResult.keywordAnalysis.missingKeywords.map((kw, i) => <Tag key={i} colorScheme="red">{kw}</Tag>)}
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
