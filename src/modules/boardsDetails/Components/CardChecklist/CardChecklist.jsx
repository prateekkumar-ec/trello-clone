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
} from "@chakra-ui/react";
import { EditIcon, CheckIcon, AddIcon } from "@chakra-ui/icons";
import axios from "axios";
import { useState, useEffect } from "react";
import CheckItem from "../CheckItem/CheckItem";
import config from "../../../../../config";

const apiKey = config.apiKey;
const token = config.token;

function CardChecklist({ checklist, getChecklists, card }) {
    const [checkItems, setCheckItems] = useState([]);
    const [isCheckItemsLoaded, setIsCheckItemsLoaded] = useState(false);
    const [progressInfo, setProgressInfo] = useState({ value: 0, checked: 0, length: 0 });

    useEffect(() => {
        getCheckItems();
    }, []);

    function getCheckItems() {
        axios(`https://api.trello.com/1/checklists/${checklist.id}/checkItems?key=${apiKey}&token=${token}`, { method: "GET" })
            .then((response) => {
                setCheckItems(response.data);
                setProgressInfo({ ...progressInfo, length: response.data.length });
                setIsCheckItemsLoaded(true);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    function deleteChecklist() {
        axios(`https://api.trello.com/1/checklists/${checklist.id}?key=${apiKey}&token=${token}`, {
            method: "Delete",
        }).then((response) => {
            getChecklists();
        });
    }
    function createCheckItem(name) {
        if (name == "") {
            return;
        }
        axios(`https://api.trello.com/1/checklists/${checklist.id}/checkItems?name=${name}&key=${apiKey}&token=${token}`, {
            method: "POST",
        })
            .then((response) => {
                console.log(response);
                getCheckItems();
            })
            .catch((error) => {
                console.log(error);
            });
    }

    if (checkItems) {
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
                                    <Button onClick={deleteChecklist} colorScheme="red" ml={3}>
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
                    {checkItems.map((checkItem) => {
                        return (
                            <CheckItem
                                key={checkItem.id}
                                checklist={checklist}
                                getCheckItems={getCheckItems}
                                checkItem={checkItem}
                                setProgressInfo={setProgressInfo}
                                progressInfo={progressInfo}
                                card={card}
                            />
                        );
                    })}
                    <Flex marginTop={"0.8rem"}>
                        <Flex marginLeft={"1rem"} gap={"1rem"} alignItems={"center"} background={"#3B444C"} padding={"0.3rem 1rem"} borderRadius={"7px"}>
                            <AddIcon />
                            <Editable onSubmit={createCheckItem} placeholder={"Add an item"} defaultValue="">
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

export default CardChecklist;
