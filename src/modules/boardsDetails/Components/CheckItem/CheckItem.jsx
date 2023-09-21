import { useToast, Checkbox, Flex, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import ThreeDots from "../../../../assets/threeDots.svg";
import axios from "axios";
import { useEffect, useState } from "react";
import config from "../../../../../config";
const { apiKey, token } = config;

function CheckItem({ card, checklist, checkItem, progressInfo, setProgressInfo, checkItems, setCheckItems }) {
    const [checked, setChecked] = useState(false);
    const toast = useToast();
    useEffect(() => {
        if (checkItem.state == "complete") {
            setChecked(true);
        } else {
            setChecked(false);
        }
    }, []);

    function handleCheckbox(event) {
        if (event.target.checked == true) {
            setChecked(true);
            let newProgress = (progressInfo.checked + 1) / progressInfo.length;
            newProgress *= 100;
            setProgressInfo({ ...progressInfo, value: newProgress, checked: progressInfo.checked + 1 });
            updateCheckItemState("complete");
        } else {
            setChecked(false);
            let newProgress = (progressInfo.checked - 1) / progressInfo.length;
            newProgress *= 100;
            setProgressInfo({ ...progressInfo, value: newProgress, checked: progressInfo.checked - 1 });
            updateCheckItemState("incomplete");
        }
    }
    function deleteCheckItem() {
        axios(`https://api.trello.com/1/checklists/${checklist.id}/checkItems/${checkItem.id}?key=${apiKey}&token=${token}`, {
            method: "Delete",
        })
            .then((reponse) => {
                setCheckItems(() => {
                    return checkItems.filter((item) => {
                        return item.id != checkItem.id;
                    });
                });
                let new_value;
                if (checked) {
                    if (progressInfo.length - 1 == 0) {
                        setProgressInfo({ checked: 0, length: 0, value: 0 });
                    } else {
                        new_value = (progressInfo.checked - 1) / (progressInfo.length - 1);
                        new_value *= 100;
                        setProgressInfo({ checked: progressInfo.checked - 1, length: progressInfo.length - 1, value: new_value });
                    }
                } else {
                    if (progressInfo.length - 1 == 0) {
                        setProgressInfo({ checked: 0, length: 0, value: 0 });
                    } else {
                        new_value = progressInfo.checked / (progressInfo.length - 1);
                        new_value *= 100;
                        setProgressInfo({ ...progressInfo, length: progressInfo.length - 1, value: new_value });
                    }
                }
                toast({
                    title: " Deleted!",
                    description: "Your card is deleted successfully.",
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

    function updateCheckItemState(stateValue) {
        axios(`https://api.trello.com/1/cards/${card.id}/checkItem/${checkItem.id}?key=${apiKey}&token=${token}`, {
            method: "PUT",
            params: {
                state: stateValue,
            },
        })
            .then((response) => {
                setCheckItems(() => {
                    return checkItems.map((item) => {
                        if (item.id == checkItem.id) {
                            return { ...item, state: stateValue };
                        } else {
                            return item;
                        }
                    });
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    return (
        <Flex justify={"space-between"}>
            <Checkbox onChange={handleCheckbox} colorScheme="green" marginLeft={"1rem"} textDecoration={checked ? "line-through" : ""} isChecked={checked}>
                {checkItem.name}
            </Checkbox>
            <Menu>
                <MenuButton>
                    <img src={ThreeDots}></img>
                </MenuButton>
                <MenuList bgColor={"#282E33"}>
                    <MenuItem onClick={deleteCheckItem} bg={"#282E33"}>
                        Delete
                    </MenuItem>
                </MenuList>
            </Menu>
        </Flex>
    );
}

export default CheckItem;
