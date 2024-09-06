import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
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

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [searchParams] = useSearchParams();
  const toast = useToast();
  const token = searchParams.get("token");

  useEffect(() => {
    socket.on("password-reset-success", (data) => {
      setMessage(data.message);
      toast({
        title: "Password Reset Success",
        description: data.message,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    });

    return () => {
      socket.off("password-reset-success");
    };
  }, [toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      toast({
        title: "Error",
        description: "Passwords do not match!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          newPassword: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Error resetting password.");
        toast({
          title: "Error",
          description: data.message || "Error resetting password.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      } else {
        toast({
          title: "Success",
          description: "Password reset successfully!",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      }
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setMessage("Error resetting password.");
      toast({
        title: "Error",
        description: "Error resetting password.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

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
          Reset Password
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
            <FormControl id="password" isRequired>
              <FormLabel>New Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </FormControl>
            <FormControl id="confirmPassword" isRequired>
              <FormLabel>Confirm New Password</FormLabel>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
            </FormControl>
            <Button colorScheme="blue" type="submit" width="full">
              Reset Password
            </Button>
          </VStack>
        </form>
      </Container>
    </Box>
  );
};

export default ResetPassword;
