import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Input,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  VStack,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { IoAdd, IoTrash } from "react-icons/io5";

export interface HttpSource {
  url: string;
}

export interface HttpSourcesListProps {
  sources: HttpSource[];
  loading?: boolean;
  onAddSources: (urls: string) => Promise<void>;
  onRemoveSources: (urls: string) => Promise<void>;
}

const HttpSourcesList = ({
  sources,
  loading = false,
  onAddSources,
  onRemoveSources,
}: HttpSourcesListProps) => {
  const [newSource, setNewSource] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const borderColor = useColorModeValue("gray.200", "gray.700");
  const theadBg = useColorModeValue("gray.100", "gray.700");
  const addBoxBg = useColorModeValue("gray.50", "gray.800");

  const handleAdd = async () => {
    if (!newSource.trim()) return;
    setIsAdding(true);
    try {
      await onAddSources(newSource.trim());
      setNewSource("");
    } catch (e) {
      console.error(e);
    } finally {
      setIsAdding(false);
    }
  };

  if (loading && sources.length === 0) {
    return (
      <Flex justify="center" align="center" py={10}>
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <VStack spacing={6} align="stretch" w="100%">
      <Box p={4} borderRadius="lg" bg={addBoxBg}>
        <FormControl>
          <FormLabel>Add HTTP Source</FormLabel>
          <HStack>
            <Input
              placeholder="http://example.com/file"
              value={newSource}
              onChange={(e) => setNewSource(e.target.value)}
            />
            <Button
              leftIcon={<IoAdd />}
              colorScheme="blue"
              onClick={handleAdd}
              isLoading={isAdding}
              isDisabled={!newSource.trim()}
            >
              Add
            </Button>
          </HStack>
        </FormControl>
      </Box>

      <Box overflowX="auto" borderRadius="lg" border="1px solid" borderColor={borderColor}>
        <Table variant="simple" size="sm">
          <Thead bg={theadBg}>
            <Tr>
              <Th>URL</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {sources.map((source) => (
              <Tr key={source.url}>
                <Td>
                  <Text noOfLines={1} fontSize="xs">
                    {source.url}
                  </Text>
                </Td>
                <Td>
                  <IconButton
                    aria-label="Remove source"
                    icon={<IoTrash />}
                    size="xs"
                    variant="ghost"
                    colorScheme="red"
                    onClick={() => onRemoveSources(source.url)}
                  />
                </Td>
              </Tr>
            ))}
            {sources.length === 0 && (
              <Tr>
                <Td colSpan={2} textAlign="center" py={4} color="gray.500">
                  No HTTP sources found
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box>
    </VStack>
  );
};

export default HttpSourcesList;
