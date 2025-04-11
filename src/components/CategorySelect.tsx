import {Button, Flex, Heading, useDisclosure} from "@chakra-ui/react";
import {IoChevronDown} from "react-icons/io5";
import IosActionSheet from "./ios/IosActionSheet";
import React from "react";
import {useQuery} from "react-query";
import {TorrClient} from "../utils/TorrClient";

export type CategorySelectProps = {
    category:string;
    onSelected: (category:string) => void;
}

const CategorySelect = ({category, onSelected}:CategorySelectProps) => {

  const catDisclosure = useDisclosure();

  const { data: categories } = useQuery(
    "torrentsCategory",
    TorrClient.getCategories, {
      staleTime: 10000
    }
  );

  return (
   <>
     <Flex alignItems={"center"}>
       <Button opacity={category ? "100%" : "50%"} variant={"unstyled"} display={"flex"} minH={0} height={"auto"} rightIcon={<IoChevronDown />} onClick={catDisclosure.onOpen}>
         <Heading size={"sm"}>{category || "Category"}</Heading>
       </Button>
     </Flex>
     <IosActionSheet disclosure={catDisclosure} options={[
       {label: "No Category", onClick: () => onSelected("")},
       ...(Object.values(categories ?? {})?.map((cat) => ({
         label:cat.name,
         onClick: () => {
           onSelected(cat.name)
         }
       }))),
     ]}/>
   </>
 );
};

export default CategorySelect
