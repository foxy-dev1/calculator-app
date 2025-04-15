import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Spinner, 
  Progress, 
  Heading, 
  Text, 
  VStack, 
  HStack,
  SimpleGrid,
  Center,
  Container,
  useColorModeValue,
  Image,
  Fade,
  Flex
} from '@chakra-ui/react';
import './HomePage.css';

const loadingMessages = [
  "Installing Math OS v∞.∞...",
  "Calculating why calculators exist...",
  "Fetching digits from the cloud ☁️...",
  "Debugging your math trauma...",
  "Dividing by zero (just kidding!)...",
  "Solving the meaning of life (it's 42)...",
  "Converting coffee to code...",
  "Making math fun again (impossible task)...",
  "Reticulating splines...",
  "Consulting the ancient mathematics scrolls..."
];

const HomePage = ({ onStart }) => {
  const [loading, setLoading] = useState(true);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (loading) {
      // Update loading message every 1.5 seconds
      const messageInterval = setInterval(() => {
        setCurrentMessage((prev) => (prev + 1) % loadingMessages.length);
      }, 1500);

      // Increase progress bar
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newValue = prev + 10;
          if (newValue >= 100) {
            clearInterval(progressInterval);
            // Wait a bit after reaching 100% before showing homepage
            setTimeout(() => setLoading(false), 500);
            return 100;
          }
          return newValue;
        });
      }, 600);

      return () => {
        clearInterval(messageInterval);
        clearInterval(progressInterval);
      };
    }
  }, [loading]);

  // Generate math symbols for background
  const generateSymbols = () => {
    const symbols = ['➕', '➖', '✖️', '➗', '💯', '🔢', '🧮', '🔄', '🔣', '📊', '📈', '👨‍🔬', '🤓', '✏️', '=', 'π', '∞', '√', '∑', 'Δ'];
    const elements = [];
    
    for (let i = 0; i < 50; i++) {
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];
      elements.push(
        <Text 
          key={i}
          position="absolute"
          top={`${Math.random() * 100}%`}
          left={`${Math.random() * 100}%`}
          fontSize={`${Math.random() * 3 + 0.8}rem`}
          className="floating-symbol"
          animation={`float ${Math.random() * 10 + 8}s infinite ease-in-out`}
          style={{ 
            animationDelay: `${Math.random() * 5}s`,
            opacity: Math.random() * 0.3 + 0.1
          }}
        >
          {symbol}
        </Text>
      );
    }
    return elements;
  };

  return (
    <Box className="home-container">
      <Box className="math-symbols">
        {generateSymbols()}
      </Box>

      {loading ? (
        <Center className="loading-container">
          <Fade in={true}>
            <VStack spacing={8} align="center" justify="center" zIndex={1}>
              <Box className="emoji-float loading-emoji">
                🧮
              </Box>
              <Spinner
                thickness="5px"
                speed="0.65s"
                emptyColor="gray.700"
                color="pink.400"
                size="xl"
              />
              <Text 
                fontSize="2xl" 
                fontWeight="bold" 
                textAlign="center"
                className="loading-text"
              >
                {loadingMessages[currentMessage]}
              </Text>
              <Progress 
                hasStripe 
                isAnimated
                className="progress-bar"
                max={100} 
                value={progress} 
                colorScheme="pink"
                borderRadius="full"
              />
            </VStack>
          </Fade>
        </Center>
      ) : (
        <Fade in={true}>
          <Container maxW="full" className="content-container">
            <Box className="hero-section">
              <Box className="emoji-float" fontSize="6xl" mb={6}>
                🧮✨
              </Box>
              <Heading as="h1" className="welcome-title">
                Math<span className="gradient-text">Magician</span>
              </Heading>
              
              <Text className="subtitle">
                Welcome to the most unnecessarily dramatic calculator ever created.
                We've spent thousands of hours making simple arithmetic look fancy.
              </Text>
            </Box>

            <SimpleGrid columns={[1, 2, 4]} spacing={6} className="feature-list">
              {[
                { icon: "➕", text: "Basic Calculations", description: "Add, subtract, multiply, divide - but with style!" },
                { icon: "🧪", text: "Scientific Mode", description: "For when basic math just isn't complicated enough" },
                { icon: "🕳️", text: "Black Hole Feature", description: "Watch your calculations get sucked into the void" },
                { icon: "🎭", text: "Fun/Serious Modes", description: "Toggle between work and play at the press of a button" },
                { icon: "🎮", text: "Interactive UI", description: "Buttons that actually look like they do something" },
                { icon: "🙄", text: "Sarcastic Comments", description: "Get judged by your calculator with every calculation" },
                { icon: "🔮", text: "Magic Results", description: "Sometimes the answer is magic, not math" },
                { icon: "🎉", text: "Easter Eggs", description: "Find hidden features that make absolutely no sense" }
              ].map((feature, i) => (
                <VStack 
                  key={i}
                  bg="rgba(255,255,255,0.1)" 
                  p={6}
                  borderRadius="xl"
                  align="center"
                  className="feature-card"
                >
                  <Text fontSize="4xl" mb={2}>{feature.icon}</Text>
                  <Text fontWeight="bold" fontSize="lg">{feature.text}</Text>
                  <Text fontSize="sm" textAlign="center">{feature.description}</Text>
                </VStack>
              ))}
            </SimpleGrid>

            <Center mt={12}>
              <Button 
                onClick={onStart}
                className="start-button"
                _hover={{ transform: "translateY(-3px)", boxShadow: "0 6px 20px rgba(0, 0, 0, 0.3)" }}
              >
                Start Calculating
              </Button>
            </Center>

            <Text className="footer">
              Warning: May occasionally make you question your life choices.
            </Text>
          </Container>
        </Fade>
      )}
    </Box>
  );
};

export default HomePage;