import React, { useState } from "react";
import PageHeader from "../components/PageHeader";
import { useMutation, useQuery } from "react-query";
import { TorrClient } from "../utils/TorrClient";
import {
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  LightMode,
  Tag,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { IoTrash } from "react-icons/io5";
import IosBottomSheet from "../components/ios/IosBottomSheet";
import { TorrCategory } from "../types";
import { Input } from "@chakra-ui/input";
import { useIsLargeScreen } from "../utils/screenSize";
import { MobileSettingsAddButton } from "./SearchPluginsPage";
import { useLocation } from "react-router-dom";
import { Pages } from "../Pages";

const CategoriesPage = () => {
  const { data, refetch } = useQuery(
    "getCategoriesPage",
    TorrClient.getCategories
  );

  const location = useLocation();
  const isPage =
    location.pathname ===
    Pages.find((page) => page.label === "Categories")?.url;

  const { data: settings } = useQuery("settings", TorrClient.getSettings);

  const editDisclosure = useDisclosure();

  const addCategoryObject: TorrCategory = {
    name: "",
    savePath: "",
  };

  const [selectedCategory, setSelectedCategory] = useState<{
    mode: "Add" | "Edit";
    cat: TorrCategory;
  }>({ mode: "Add", cat: addCategoryObject });

  const updateCategoryField = (key: keyof TorrCategory, val: string) => {
    setSelectedCategory((curr) => {
      return {
        ...curr,
        cat: {
          ...curr.cat,
          [key]: val,
        },
      };
    });
  };

  const { mutate: saveCategory, isLoading: saveCategoryLoading } = useMutation(
    "addEditCategory",
    async () => {
      if (selectedCategory.mode === "Add") {
        await TorrClient.addCategory(
          selectedCategory.cat.name,
          selectedCategory.cat.savePath
        );
      } else {
        await TorrClient.saveCategory(
          selectedCategory.cat.name,
          selectedCategory.cat.savePath
        );
      }
    },
    {
      onSuccess: async () => {
        await refetch();
        editDisclosure.onClose();
      },
    }
  );

  const { mutate: removeCategory, isLoading: removeCategoryLoading } =
    useMutation("removeCategory", TorrClient.removeCategories, {
      onSuccess: async () => {
        await refetch();
        editDisclosure.onClose();
      },
    });

  const isLarge = useIsLargeScreen();
  const backgroundColor = useColorModeValue(
    "white",
    isLarge ? "black" : "gray.900"
  );

  return (
    <>
      {isLarge || isPage ? (
        <PageHeader
          title={"Categories"}
          onAddButtonClick={() => {
            setSelectedCategory({ mode: "Add", cat: addCategoryObject });
            editDisclosure.onOpen();
          }}
          buttonLabel={"Add Category"}
        />
      ) : (
        <MobileSettingsAddButton
          addPluginDisclosure={editDisclosure}
          onClick={() =>
            setSelectedCategory({ mode: "Add", cat: addCategoryObject })
          }
        />
      )}

      {Object.values(data || {}).map((cat, index) => (
        <Flex
          key={index}
          shadow={"lg"}
          p={5}
          rounded={"2xl"}
          mt={4}
          justifyContent={"space-between"}
          alignItems={"center"}
          bgColor={backgroundColor}
        >
          <Flex flexDirection={"column"}>
            <Heading size={"lg"}>{cat.name}</Heading>
            <Text noOfLines={1} color={"grayAlpha.800"}>
              {cat.savePath}
            </Text>
          </Flex>
          <Button
            variant={"ghost"}
            fontSize={"md"}
            colorScheme={"blue"}
            minHeight={"100%"}
            onClick={() => {
              setSelectedCategory({ mode: "Edit", cat });
              editDisclosure.onOpen();
            }}
          >
            Edit
          </Button>
        </Flex>
      ))}

      <IosBottomSheet
        title={`${selectedCategory.mode} Category`}
        disclosure={editDisclosure}
      >
        <Flex flexDirection={"column"} gap={5}>
          <FormControl>
            <FormLabel>Category Name</FormLabel>
            {selectedCategory.mode === "Edit" ? (
              <Heading size={"lg"}>{selectedCategory.cat.name}</Heading>
            ) : (
              <Input
                value={selectedCategory.cat.name}
                onChange={(event) =>
                  updateCategoryField("name", event.target.value)
                }
              />
            )}
          </FormControl>
          <FormControl>
            <FormLabel>Category Save Path</FormLabel>
            <Input
              value={selectedCategory.cat.savePath}
              onChange={(event) =>
                updateCategoryField("savePath", event.target.value)
              }
            />
            <FormHelperText display={"flex"} alignItems={"center"} gap={2}>
              <Text>Default:</Text>
              <Tag>{settings?.save_path}</Tag>
            </FormHelperText>
          </FormControl>
          <Flex gap={3} mt={10}>
            {selectedCategory.mode === "Edit" && (
              <Button
                size={"lg"}
                colorScheme={"red"}
                variant={"ghost"}
                isLoading={removeCategoryLoading}
                onClick={() => removeCategory(selectedCategory.cat.name)}
              >
                <IoTrash size={28} />
              </Button>
            )}
            <LightMode>
              <Button
                isLoading={saveCategoryLoading}
                disabled={
                  !selectedCategory.cat.name || !selectedCategory.cat.savePath
                }
                type={"submit"}
                colorScheme={"blue"}
                width={"100%"}
                size={"lg"}
                onClick={() => saveCategory()}
              >
                {selectedCategory.mode === "Add" ? "Add" : "Save"} Category
              </Button>
            </LightMode>
          </Flex>
        </Flex>
      </IosBottomSheet>
    </>
  );
};

export default CategoriesPage;
