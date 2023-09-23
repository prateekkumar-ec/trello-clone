import {
    Editable,
    EditablePreview,
    EditableInput,
    Text,
    Button,
    Flex,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverCloseButton,
    Progress,
    useToast,
} from "@chakra-ui/react";
import { CheckIcon, AddIcon } from "@chakra-ui/icons";
import axios from "axios";
import { useState, useEffect, useReducer } from "react";
import CheckItem from "../CheckItem/CheckItem";
import config from "../../../../../config";

const apiKey = config.apiKey;
const token = config.token;

function CardChecklist({ checklist, dispatchChecklists, card }) {
    const [checkItems, dispatchCheckItems] = useReducer(checkItemsReducer, { data: [], isCheckItemsLoaded: false });

    const [progressInfo, dispatchProgressInfo] = useReducer(progressInfoReducer, { value: 0, checked: 0, length: 0 });

    const toast = useToast();

    useEffect(() => {
        axios(`https://api.trello.com/1/checklists/${checklist.id}/checkItems?key=${apiKey}&token=${token}`, { method: "GET" })
            .then((response) => {
                dispatchCheckItems({
                    type: "get",
                    data: response.data,
                });
                dispatchProgressInfo({
                    type: "get",
                    data: response.data,
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    if (checkItems.isCheckItemsLoaded) {
        return (
            <Flex className="checklist-container" direction={"column"}>
                <Flex className="checklist-header" justify={"space-between"}>
                    <Flex gap={"1rem"} align={"center"}>
                        <CheckIcon></CheckIcon>
                        <Text>{checklist.name}</Text>
                    </Flex>
                    <Popover placement="right">
                        <PopoverTrigger>
                            <Button colorScheme="red">Delete</Button>
                        </PopoverTrigger>

                        <PopoverContent>
                            <PopoverContent>
                                <PopoverCloseButton color={"black"} />
                                <PopoverHeader color={"black"}>Are you sure?</PopoverHeader>
                                <PopoverBody>
                                    <Button onClick={() => deleteChecklist(checklist, dispatchChecklists, toast)} colorScheme="red" ml={3}>
                                        Delete
                                    </Button>
                                </PopoverBody>
                            </PopoverContent>
                        </PopoverContent>
                    </Popover>
                </Flex>
                <Flex justify={"space-between"} align={"center"}>
                    <Text color={"#B6C2CF"} fontSize={"11px"}>
                        {Math.floor(progressInfo.value)}%
                    </Text>
                    <Progress value={progressInfo.value} margin={"1rem 0"} flexBasis={"90%"} borderRadius={"4px"} height={"8px"} />
                </Flex>
                <Flex direction={"column"}>
                    {checkItems.data.map((checkItem) => {
                        return (
                            <CheckItem
                                key={checkItem.id}
                                checklist={checklist}
                                checkItem={checkItem}
                                dispatchCheckItems={dispatchCheckItems}
                                dispatchProgressInfo={dispatchProgressInfo}
                                card={card}
                            />
                        );
                    })}
                    <Flex marginTop={"0.8rem"}>
                        <Flex marginLeft={"1rem"} gap={"1rem"} alignItems={"center"} background={"#3B444C"} padding={"0.3rem 1rem"} borderRadius={"7px"}>
                            <AddIcon />
                            <Editable
                                onSubmit={(event) => createCheckItem(event, checklist, dispatchCheckItems, dispatchProgressInfo, toast)}
                                placeholder={"Add an item"}
                                defaultValue=""
                            >
                                <EditablePreview cursor={"pointer"} />
                                <EditableInput />
                            </Editable>
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
        );
    }
}

function createCheckItem(name, checklist, dispatchCheckItems, dispatchProgressInfo, toast) {
    if (name == "") {
        return;
    }
    axios(`https://api.trello.com/1/checklists/${checklist.id}/checkItems?name=${name}&key=${apiKey}&token=${token}`, {
        method: "POST",
    })
        .then((response) => {
            dispatchCheckItems({
                type: "add",
                data: response.data,
            });
            dispatchProgressInfo({
                type: "itemAdded",
            });
            toast({
                title: " Created!",
                description: "A new check item is created successfully.",
                status: "success",
                duration: 9000,
                isClosable: true,
            });
        })
        .catch((error) => {
            toast({
                title: "Failed to create card.",
                description: "Try checking your network.",
                status: "error",
                duration: 9000,
                isClosable: true,
            });
        });
}

function deleteChecklist(checklist, dispatchChecklists, toast) {
    axios(`https://api.trello.com/1/checklists/${checklist.id}?key=${apiKey}&token=${token}`, {
        method: "Delete",
    })
        .then((response) => {
            dispatchChecklists({
                type: "delete",
                id: checklist.id,
            });
            toast({
                title: " Deleted!",
                description: "Your checklist is deleted successfully..",
                status: "info",
                duration: 9000,
                isClosable: true,
            });
        })
        .catch((error) => {
            toast({
                title: " Failed to delete!",
                description: "Try checking your network.",
                status: "error",
                duration: 9000,
                isClosable: true,
            });
        });
}
function checkItemsReducer(checkItems, action) {
    switch (action.type) {
        case "get": {
            return { ...checkItems, data: action.data, isCheckItemsLoaded: true };
        }
        case "add": {
            return { ...checkItems, data: [...checkItems.data, action.data] };
        }
        case "delete": {
            let new_data = checkItems.data.filter((item) => {
                return item.id != action.id;
            });
            return { ...checkItems, data: new_data };
        }
        case "updateState": {
            let new_data = checkItems.data.map((item) => {
                if (item.id == action.id) {
                    return { ...item, state: action.stateValue };
                } else {
                    return item;
                }
            });
            return { ...checkItems, data: new_data };
        }
    }
}

function progressInfoReducer(progressInfo, action) {
    switch (action.type) {
        case "get": {
            if (action.data.length == 0) {
                return { ...progressInfo };
            }
            let new_checked = 0;
            for (let item of action.data) {
                if (item.state == "complete") {
                    new_checked++;
                }
            }
            let newProgress = new_checked / action.data.length;
            newProgress *= 100;

            return { length: action.data.length, value: newProgress, checked: new_checked };
        }
        case "itemAdded": {
            let new_value = progressInfo.checked / (progressInfo.length + 1);
            new_value *= 100;
            return { ...progressInfo, length: progressInfo.length + 1, value: new_value };
        }
        case "itemDeleted": {
            let new_value;
            if (action.checked) {
                if (progressInfo.length - 1 == 0) {
                    return { checked: 0, length: 0, value: 0 };
                } else {
                    new_value = (progressInfo.checked - 1) / (progressInfo.length - 1);
                    new_value *= 100;
                    return { checked: progressInfo.checked - 1, length: progressInfo.length - 1, value: new_value };
                }
            } else {
                if (progressInfo.length - 1 == 0) {
                    return { checked: 0, length: 0, value: 0 };
                } else {
                    new_value = progressInfo.checked / (progressInfo.length - 1);
                    new_value *= 100;
                    return { ...progressInfo, length: progressInfo.length - 1, value: new_value };
                }
            }
        }
        case "increment": {
            let newProgress = (progressInfo.checked + 1) / progressInfo.length;
            newProgress *= 100;
            return { ...progressInfo, value: newProgress, checked: progressInfo.checked + 1 };
        }
        case "decrement": {
            let newProgress = (progressInfo.checked - 1) / progressInfo.length;
            newProgress *= 100;
            return { ...progressInfo, value: newProgress, checked: progressInfo.checked - 1 };
        }
    }
}
export default CardChecklist;
