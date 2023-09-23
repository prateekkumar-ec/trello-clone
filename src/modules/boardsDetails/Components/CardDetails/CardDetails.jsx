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
import { useEffect, useReducer, useState } from "react";
import React from "react";
import CardChecklist from "../CardChecklist/CardChecklist";
import config from "../../../../../config";

const apiKey = config.apiKey;
const token = config.token;

function CardDetails({ card }) {
    const [checklists, dispatchChecklists] = useReducer(checklistsReducer, { data: [], isChecklistLoaded: false });

    useEffect(() => {
        axios(`https://api.trello.com/1/cards/${card.id}/checklists?key=${apiKey}&token=${token}`, {
            method: "GET",
        })
            .then((response) => {
                dispatchChecklists({
                    type: "get",
                    data: response.data,
                });
            })
            .catch((error) => {
                dispatchChecklists({
                    type: "error",
                    error: error,
                });
            });
    }, []);

    if (checklists.isChecklistLoaded) {
        return (
            <Flex justify={"space-between"} paddingBottom={"2rem"}>
                <Flex direction={"column"} gap={"2rem"} flexBasis={"75%"}>
                    {checklists.data.map((checklist) => {
                        return <CardChecklist key={checklist.id} checklist={checklist} dispatchChecklists={dispatchChecklists} card={card} />;
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
                                <Editable
                                    onSubmit={(event) => createChecklist(event, card, dispatchChecklists)}
                                    placeholder={"Add checklist"}
                                    defaultValue=""
                                    background={"#3B444C"}
                                >
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
function createChecklist(name, card, dispatchChecklists) {
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
            dispatchChecklists({
                type: "add",
                data: response.data,
            });
        })
        .catch((error) => {
            console.log(error);
        });
}

function checklistsReducer(checklists, action) {
    switch (action.type) {
        case "get": {
            return { ...checklists, data: action.data, isChecklistLoaded: true };
        }
        case "add": {
            return { ...checklists, data: [...checklists.data, action.data] };
        }
        case "delete": {
            let new_data = checklists.data.filter((item) => {
                return item.id != action.id;
            });
            return { ...checklists, data: new_data };
        }
    }
}
export default CardDetails;
