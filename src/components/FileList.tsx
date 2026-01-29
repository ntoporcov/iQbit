import React, { useState, useMemo } from "react";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  HStack,
  Input,
  Progress,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { TorrFile, TorrFilePriority } from "../types";
import filesize from "filesize";
import { IoChevronDown } from "react-icons/io5";

export interface FileListProps {
  files: TorrFile[];
  loading?: boolean;
  onSetPriority?: (fileIndex: number, priority: TorrFilePriority) => Promise<void>;
  onSetMultiplePriorities?: (fileIndices: number[], priority: TorrFilePriority) => Promise<void>;
}

const priorityLabels: Record<TorrFilePriority, string> = {
  0: "Skip",
  1: "Normal",
  2: "High",
  7: "Maximal",
};

const FileList = ({
  files,
  loading = false,
  onSetPriority,
  onSetMultiplePriorities,
}: FileListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());
  const [loadingIndices, setLoadingIndices] = useState<Set<number>>(new Set());

  const borderColor = useColorModeValue("gray.200", "gray.700");
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  const bulkBg = useColorModeValue("blue.50", "blue.900");
  const theadBg = useColorModeValue("gray.100", "gray.700");
  const summaryBg = useColorModeValue("gray.50", "gray.800");

  const filteredFiles = useMemo(() => {
    if (!searchTerm) return files;
    const lowerSearch = searchTerm.toLowerCase();
    return files.filter((file) => file.name.toLowerCase().includes(lowerSearch));
  }, [files, searchTerm]);

  const handleSelectFile = (fileIndex: number) => {
    const newSelected = new Set(selectedIndices);
    if (newSelected.has(fileIndex)) {
      newSelected.delete(fileIndex);
    } else {
      newSelected.add(fileIndex);
    }
    setSelectedIndices(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedIndices.size === filteredFiles.length) {
      setSelectedIndices(new Set());
    } else {
      setSelectedIndices(new Set(filteredFiles.map((f) => f.index)));
    }
  };

  const handlePriorityChange = async (
    fileIndex: number,
    priority: TorrFilePriority
  ) => {
    if (!onSetPriority) return;

    setLoadingIndices((prev) => new Set(prev).add(fileIndex));
    try {
      await onSetPriority(fileIndex, priority);
    } catch (error) {
      console.error("Failed to set priority:", error);
    } finally {
      setLoadingIndices((prev) => {
        const next = new Set(prev);
        next.delete(fileIndex);
        return next;
      });
    }
  };

  const handleBulkPriority = async (priority: TorrFilePriority) => {
    if (!onSetMultiplePriorities || selectedIndices.size === 0) return;

    const indices = Array.from(selectedIndices);
    setLoadingIndices((prev) => {
      const next = new Set(prev);
      for (let i = 0; i < indices.length; i++) {
        next.add(indices[i]);
      }
      return next;
    });
    try {
      await onSetMultiplePriorities(indices, priority);
      setSelectedIndices(new Set());
    } catch (error) {
      console.error("Failed to set bulk priority:", error);
    } finally {
      setLoadingIndices((prev) => {
        const next = new Set(prev);
        indices.forEach((i) => next.delete(i));
        return next;
      });
    }
  };

  if (loading) {
    return (
      <Flex justifyContent="center" alignItems="center" py={8}>
        <Spinner />
      </Flex>
    );
  }

  if (files.length === 0) {
    return (
      <Flex justifyContent="center" alignItems="center" py={8}>
        <Text>No files in this torrent</Text>
      </Flex>
    );
  }

  return (
    <VStack width="100%" align="stretch" spacing={4}>
      {/* Search Bar */}
      <Input
        placeholder="Search files..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        size="sm"
      />

      {/* Bulk Actions */}
      {selectedIndices.size > 0 && (
        <Box
          p={3}
          bg={bulkBg}
          rounded="md"
          borderLeft="4px"
          borderColor="blue.500"
        >
          <Flex justifyContent="space-between" alignItems="center" gap={3}>
            <Text fontWeight="bold">
              {selectedIndices.size} file{selectedIndices.size !== 1 ? "s" : ""} selected
            </Text>
            <HStack gap={2}>
              <Button
                size="sm"
                colorScheme="green"
                isDisabled={loadingIndices.size > 0}
                onClick={() => handleBulkPriority(2)}
              >
                Set High Priority
              </Button>
              <Button
                size="sm"
                colorScheme="orange"
                isDisabled={loadingIndices.size > 0}
                onClick={() => handleBulkPriority(1)}
              >
                Set Normal Priority
              </Button>
              <Button
                size="sm"
                colorScheme="red"
                isDisabled={loadingIndices.size > 0}
                onClick={() => handleBulkPriority(0)}
              >
                Skip Files
              </Button>
            </HStack>
          </Flex>
        </Box>
      )}

      {/* Files Table */}
      <Box
        overflowX="auto"
        borderRadius="md"
        borderWidth={1}
        borderColor={borderColor}
      >
        <Table size="sm" variant="simple">
          <Thead bg={theadBg}>
            <Tr>
              <Th width={10}>
                <Checkbox
                  isChecked={
                    filteredFiles.length > 0 &&
                    selectedIndices.size === filteredFiles.length
                  }
                  isIndeterminate={
                    selectedIndices.size > 0 &&
                    selectedIndices.size < filteredFiles.length
                  }
                  onChange={handleSelectAll}
                />
              </Th>
              <Th>File Name</Th>
              <Th isNumeric>Size</Th>
              <Th isNumeric>Progress</Th>
              <Th>Priority</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredFiles.map((file) => (
              <Tr
                key={file.index}
                _hover={{ bg: hoverBg }}
                opacity={loadingIndices.has(file.index) ? 0.6 : 1}
              >
                <Td>
                  <Checkbox
                    isChecked={selectedIndices.has(file.index)}
                    onChange={() => handleSelectFile(file.index)}
                    isDisabled={loadingIndices.has(file.index)}
                  />
                </Td>
                <Td>
                  <Text
                    fontSize="sm"
                    wordBreak="break-word"
                    title={file.name}
                    noOfLines={2}
                  >
                    {file.name}
                  </Text>
                </Td>
                <Td isNumeric>
                  <Text fontSize="sm">
                    {filesize(file.size, { round: 1 })}
                  </Text>
                </Td>
                <Td isNumeric>
                  <VStack spacing={1} align="flex-end">
                    <Text fontSize="xs">{Math.round(file.progress * 100)}%</Text>
                    <Progress
                      value={file.progress * 100}
                      size="xs"
                      width="60px"
                      colorScheme={file.progress === 1 ? "green" : "blue"}
                      hasStripe
                    />
                  </VStack>
                </Td>
                <Td>
                  <Menu>
                    <MenuButton
                      as={Button}
                      rightIcon={<IoChevronDown />}
                      size="xs"
                      colorScheme={
                        file.priority === 0
                          ? "gray"
                          : file.priority === 2
                            ? "orange"
                            : file.priority === 7
                              ? "red"
                              : "gray"
                      }
                      isLoading={loadingIndices.has(file.index)}
                      isDisabled={loadingIndices.has(file.index)}
                    >
                      {priorityLabels[file.priority as TorrFilePriority]}
                    </MenuButton>
                    <MenuList>
                      <MenuItem
                        onClick={() => handlePriorityChange(file.index, 0)}
                      >
                        Skip
                      </MenuItem>
                      <MenuItem
                        onClick={() => handlePriorityChange(file.index, 1)}
                      >
                        Normal
                      </MenuItem>
                      <MenuItem
                        onClick={() => handlePriorityChange(file.index, 2)}
                      >
                        High
                      </MenuItem>
                      <MenuItem
                        onClick={() => handlePriorityChange(file.index, 7)}
                      >
                        Maximal
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Summary Stats */}
      <Box
        p={3}
        bg={summaryBg}
        rounded="md"
        width="100%"
      >
        <Flex justifyContent="space-between" flexWrap="wrap" gap={4}>
          <VStack align="flex-start" spacing={1}>
            <Text fontSize="sm" fontWeight="bold">
              Total Files
            </Text>
            <Text fontSize="lg">{files.length}</Text>
          </VStack>
          <VStack align="flex-start" spacing={1}>
            <Text fontSize="sm" fontWeight="bold">
              Total Size
            </Text>
            <Text fontSize="lg">
              {filesize(
                files.reduce((sum, f) => sum + f.size, 0),
                { round: 1 }
              )}
            </Text>
          </VStack>
          <VStack align="flex-start" spacing={1}>
            <Text fontSize="sm" fontWeight="bold">
              Avg Progress
            </Text>
            <Text fontSize="lg">
              {Math.round(
                (files.reduce((sum, f) => sum + f.progress, 0) / files.length) *
                  100
              )}
              %
            </Text>
          </VStack>
          <VStack align="flex-start" spacing={1}>
            <Text fontSize="sm" fontWeight="bold">
              Skipped
            </Text>
            <Text fontSize="lg">
              {files.filter((f) => f.priority === 0).length}
            </Text>
          </VStack>
        </Flex>
      </Box>
    </VStack>
  );
};

export default FileList;