import {
    Text,
    Modal,
    ModalOverlay,
    ModalContent,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuDivider,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    Flex,
    List,
    Editable,
    EditablePreview,
    EditableInput,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    PopoverArrow,
    PopoverCloseButton,
    PopoverAnchor,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    AlertDialogCloseButton,
} from "@chakra-ui/react";
import { EditIcon, CheckIcon, AddIcon } from "@chakra-ui/icons";
import axios from "axios";
import { useEffect, useState } from "react";
import React from "react";
import CardChecklist from "../CardChecklist/CardChecklist";
import config from "../../../../../config";

const apiKey = config.apiKey;
const token = config.token;

function CardDetails({ card }) {
    const [checklists, setChecklists] = useState();
    const [isChecklistLoaded, setIsChecklistLoaded] = useState(false);
    useEffect(() => {
        getChecklists();
    }, []);
    function getChecklists() {
        axios(`https://api.trello.com/1/cards/${card.id}/checklists?key=${apiKey}&token=${token}`, {
            method: "GET",
        })
            .then((response) => {
                setChecklists(response.data);
                setIsChecklistLoaded(true);
            })
            .catch((error) => {
                console.log(error);
            });
    }
    function createChecklist(name) {
        if (name == "") {
            return;
        }
        axios(`https://api.trello.com/1/checklists?idCard=${card.id}&key=${apiKey}&token=${token}`, {
            method: "POST",
            params: {
                name: name,
            },
        })
            .then((response) => {
                setChecklists([...checklists, response.data]);
                setIsChecklistLoaded(true);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    if (isChecklistLoaded) {
        return (
            <Flex justify={"space-between"} paddingBottom={"2rem"}>
                <Flex direction={"column"} gap={"2rem"} flexBasis={"75%"}>
                    {checklists.map((checklist) => {
                        return <CardChecklist key={checklist.id} checklist={checklist} getChecklists={getChecklists} card={card} />;
                    })}
                </Flex>

                <Flex direction={"column"} gap={"1rem"}>
                    <Text>Add to card</Text>
                    <Menu>
                        <MenuButton as={Button}>
                            <Flex gap={"1rem"} align={"center"}>
                                <CheckIcon></CheckIcon>
                                <Text>Checklist</Text>
                            </Flex>
                        </MenuButton>
                        <MenuList background={"#323940"} padding={"1rem"} border={"1px solid white"}>
                            <Flex marginLeft={"1rem"} gap={"1rem"} alignItems={"center"}>
                                <AddIcon />
                                <Editable onSubmit={createChecklist} placeholder={"Add checklist"} defaultValue="">
                                    <EditablePreview cursor={"pointer"} />
                                    <EditableInput />
                                </Editable>
                            </Flex>
                        </MenuList>
                    </Menu>
                </Flex>
            </Flex>
        );
    }
}
export default CardDetails;
