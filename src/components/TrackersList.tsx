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
  Textarea,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { IoAdd, IoTrash, IoPencil } from "react-icons/io5";

export interface Tracker {
  url: string;
  status: number;
  tier: number;
  num_peers: number;
  num_seeds: number;
  num_leeches: number;
  num_downloaded: number;
  msg: string;
}

export interface TrackersListProps {
  trackers: Tracker[];
  loading?: boolean;
  onAddTrackers: (urls: string) => Promise<void>;
  onRemoveTrackers: (urls: string) => Promise<void>;
  onEditTracker: (origUrl: string, newUrl: string) => Promise<void>;
}

const TrackersList = ({
  trackers,
  loading = false,
  onAddTrackers,
  onRemoveTrackers,
  onEditTracker,
}: TrackersListProps) => {
  const [newTrackers, setNewTrackers] = useState("");
  const [editingUrl, setEditingUrl] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const borderColor = useColorModeValue("gray.200", "gray.700");
  const theadBg = useColorModeValue("gray.100", "gray.700");
  const addBoxBg = useColorModeValue("gray.50", "gray.800");

  const handleAdd = async () => {
    if (!newTrackers.trim()) return;
    setIsAdding(true);
    try {
      await onAddTrackers(newTrackers.trim());
      setNewTrackers("");
    } catch (e) {
      console.error(e);
    } finally {
      setIsAdding(false);
    }
  };

  const startEdit = (tracker: Tracker) => {
    setEditingUrl(tracker.url);
    setEditValue(tracker.url);
  };

  const handleEdit = async () => {
    if (!editingUrl || !editValue.trim() || editingUrl === editValue.trim()) {
      setEditingUrl(null);
      return;
    }
    try {
      await onEditTracker(editingUrl, editValue.trim());
      setEditingUrl(null);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading && trackers.length === 0) {
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
          <FormLabel>Add Trackers (one per line)</FormLabel>
          <Textarea
            placeholder="udp://tracker.example.com:6969/announce"
            value={newTrackers}
            onChange={(e) => setNewTrackers(e.target.value)}
            mb={3}
          />
          <Button
            leftIcon={<IoAdd />}
            colorScheme="blue"
            onClick={handleAdd}
            isLoading={isAdding}
            isDisabled={!newTrackers.trim()}
          >
            Add Trackers
          </Button>
        </FormControl>
      </Box>

      <Box overflowX="auto" borderRadius="lg" border="1px solid" borderColor={borderColor}>
        <Table variant="simple" size="sm">
          <Thead bg={theadBg}>
            <Tr>
              <Th>URL</Th>
              <Th isNumeric>Peers</Th>
              <Th isNumeric>Seeds</Th>
              <Th>Tier</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {trackers.map((tracker) => (
              <Tr key={tracker.url}>
                <Td maxW="300px">
                  {editingUrl === tracker.url ? (
                    <HStack>
                      <Input
                        size="xs"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                      />
                      <Button size="xs" colorScheme="green" onClick={handleEdit}>
                        Save
                      </Button>
                      <Button size="xs" onClick={() => setEditingUrl(null)}>
                        Cancel
                      </Button>
                    </HStack>
                  ) : (
                    <Text noOfLines={1} fontSize="xs">
                      {tracker.url}
                    </Text>
                  )}
                </Td>
                <Td isNumeric fontSize="xs">{tracker.num_peers}</Td>
                <Td isNumeric fontSize="xs">{tracker.num_seeds}</Td>
                <Td fontSize="xs">{tracker.tier}</Td>
                <Td>
                  <HStack spacing={1}>
                    <IconButton
                      aria-label="Edit tracker"
                      icon={<IoPencil />}
                      size="xs"
                      variant="ghost"
                      onClick={() => startEdit(tracker)}
                    />
                    <IconButton
                      aria-label="Remove tracker"
                      icon={<IoTrash />}
                      size="xs"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => onRemoveTrackers(tracker.url)}
                    />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </VStack>
  );
};

export default TrackersList;
