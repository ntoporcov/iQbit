import React from "react";
import {
    Box,
    FormControl,
    FormLabel,
    Input,
    VStack,
    Heading,
    useColorModeValue,
} from "@chakra-ui/react";
import { useLocalStorage } from "usehooks-ts";

const IntegrationsPage = () => {
    const [sonarrUrl, setSonarrUrl] = useLocalStorage("iqbit-sonarr-url", "");
    const [sonarrApiKey, setSonarrApiKey] = useLocalStorage("iqbit-sonarr-apikey", "");

    const [radarrUrl, setRadarrUrl] = useLocalStorage("iqbit-radarr-url", "");
    const [radarrApiKey, setRadarrApiKey] = useLocalStorage("iqbit-radarr-apikey", "");

    const bgColor = useColorModeValue("white", "gray.900");

    return (
        <VStack spacing={6} align="stretch" p={4} maxW="container.md" mx="auto">
            <Box p={6} bg={bgColor} borderRadius="md" shadow="sm">
                <Heading size="md" mb={4} color="teal.500">
                    Sonarr Integration
                </Heading>
                <VStack spacing={4}>
                    <FormControl>
                        <FormLabel>Sonarr URL</FormLabel>
                        <Input
                            placeholder="http://192.168.1.100:8989"
                            value={sonarrUrl}
                            onChange={(e) => setSonarrUrl(e.target.value)}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>API Key</FormLabel>
                        <Input
                            type="password"
                            placeholder="Your Sonarr API Key"
                            value={sonarrApiKey}
                            onChange={(e) => setSonarrApiKey(e.target.value)}
                        />
                    </FormControl>
                </VStack>
            </Box>

            <Box p={6} bg={bgColor} borderRadius="md" shadow="sm">
                <Heading size="md" mb={4} color="yellow.500">
                    Radarr Integration
                </Heading>
                <VStack spacing={4}>
                    <FormControl>
                        <FormLabel>Radarr URL</FormLabel>
                        <Input
                            placeholder="http://192.168.1.100:7878"
                            value={radarrUrl}
                            onChange={(e) => setRadarrUrl(e.target.value)}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>API Key</FormLabel>
                        <Input
                            type="password"
                            placeholder="Your Radarr API Key"
                            value={radarrApiKey}
                            onChange={(e) => setRadarrApiKey(e.target.value)}
                        />
                    </FormControl>
                </VStack>
            </Box>
        </VStack>
    );
};

export default IntegrationsPage;
