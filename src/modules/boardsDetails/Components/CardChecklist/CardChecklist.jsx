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
import { EditIcon, CheckIcon, AddIcon } from "@chakra-ui/icons";
import axios from "axios";
import { useState, useEffect } from "react";
import CheckItem from "../CheckItem/CheckItem";
import config from "../../../../../config";

const apiKey = config.apiKey;
const token = config.token;

function CardChecklist({ checklist, setChecklists, checklists, card }) {
    const [checkItems, setCheckItems] = useState([]);
    const [isCheckItemsLoaded, setIsCheckItemsLoaded] = useState(false);
    const [progressInfo, setProgressInfo] = useState({ value: 0, checked: 0, length: 0 });
    const toast = useToast();

    useEffect(() => {
        getCheckItems(checklist, setCheckItems, setProgressInfo, progressInfo, setIsCheckItemsLoaded);
    }, []);

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
                                    <Button onClick={() => deleteChecklist(checklist, setChecklists, checklists)} colorScheme="red" ml={3}>
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
                                checkItem={checkItem}
                                setProgressInfo={setProgressInfo}
                                progressInfo={progressInfo}
                                checkItems={checkItems}
                                setCheckItems={setCheckItems}
                                card={card}
                            />
                        );
                    })}
                    <Flex marginTop={"0.8rem"}>
                        <Flex marginLeft={"1rem"} gap={"1rem"} alignItems={"center"} background={"#3B444C"} padding={"0.3rem 1rem"} borderRadius={"7px"}>
                            <AddIcon />
                            <Editable
                                onSubmit={(event) => createCheckItem(event, checklist, checkItems, setCheckItems, progressInfo, setProgressInfo, toast)}
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

function getCheckItems(checklist, setCheckItems, setProgressInfo, progressInfo, setIsCheckItemsLoaded) {
    axios(`https://api.trello.com/1/checklists/${checklist.id}/checkItems?key=${apiKey}&token=${token}`, { method: "GET" })
        .then((response) => {
            setCheckItems(response.data);
            setProgressInfo(() => {
                if (response.data.length == 0) {
                    return progressInfo;
                }
                let new_checked = 0;
                for (let item of response.data) {
                    if (item.state == "complete") {
                        new_checked++;
                    }
                }
                let newProgress = new_checked / response.data.length;
                newProgress *= 100;

                return { length: response.data.length, value: newProgress, checked: new_checked };
            });
            setIsCheckItemsLoaded(true);
        })
        .catch((error) => {
            console.log(error);
        });
}

function createCheckItem(name, checklist, checkItems, setCheckItems, progressInfo, setProgressInfo, toast) {
    if (name == "") {
        return;
    }
    axios(`https://api.trello.com/1/checklists/${checklist.id}/checkItems?name=${name}&key=${apiKey}&token=${token}`, {
        method: "POST",
    })
        .then((response) => {
            setCheckItems([...checkItems, response.data]);
            let new_value = progressInfo.checked / (progressInfo.length + 1);
            new_value *= 100;
            setProgressInfo({ ...progressInfo, length: progressInfo.length + 1, value: new_value });
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

function deleteChecklist(checklist, setChecklists, checklists) {
    axios(`https://api.trello.com/1/checklists/${checklist.id}?key=${apiKey}&token=${token}`, {
        method: "Delete",
    }).then((response) => {
        setChecklists(() => {
            return checklists.filter((item) => {
                return item.id != checklist.id;
            });
        });
    });
}
export default CardChecklist;
