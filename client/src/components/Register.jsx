import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Text,
  VStack,
  Container,
  useToast,
} from "@chakra-ui/react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState(null);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
          name,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Error registering user.");
        toast({
          title: "Error",
          description: data.message || "Error registering user.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      } else {
        setMessage("User registered successfully!");
        toast({
          title: "Success",
          description: "User registered successfully!",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      }
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setMessage("Error registering user.");
      toast({
        title: "Error",
        description: "Error registering user.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  socket.on("user-registered", (data) => {
    toast({
      title: "Welcome!",
      description: data.message,
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "top",
    });
  });

  return (
    <Box
      minHeight="100vh"
      minWidth="100vw"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bg="gray.50"
    >
      <Container
        maxW="md"
        p={6}
        borderWidth={1}
        borderRadius="lg"
        boxShadow="lg"
        bg="white"
      >
        <Heading mb={6} textAlign="center">
          Register
        </Heading>
        {message && (
          <Text
            color={message.includes("successfully") ? "green.500" : "red.500"}
            mb={4}
          >
            {message}
          </Text>
        )}
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl id="username" isRequired>
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
              />
            </FormControl>
            <FormControl id="email" isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
              />
            </FormControl>
            <FormControl id="name" isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
            </FormControl>
            <Button colorScheme="blue" type="submit" width="full">
              Register
            </Button>
          </VStack>
        </form>
      </Container>
    </Box>
  );
};

export default Register;
