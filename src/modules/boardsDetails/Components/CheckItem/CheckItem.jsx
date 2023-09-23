import { useToast, Checkbox, Flex, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import ThreeDots from "../../../../assets/threeDots.svg";
import axios from "axios";
import { useEffect, useState } from "react";
import config from "../../../../../config";
const { apiKey, token } = config;

function CheckItem({ card, checklist, checkItem, dispatchCheckItems, dispatchProgressInfo, checkItems, setCheckItems }) {
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
            dispatchProgressInfo({
                type: "increment",
            });

            updateCheckItemState("complete");
        } else {
            setChecked(false);
            dispatchProgressInfo({
                type: "decrement",
            });

            updateCheckItemState("incomplete");
        }
    }
    function deleteCheckItem() {
        axios(`https://api.trello.com/1/checklists/${checklist.id}/checkItems/${checkItem.id}?key=${apiKey}&token=${token}`, {
            method: "Delete",
        })
            .then((reponse) => {
                dispatchCheckItems({
                    type: "delete",
                    id: checkItem.id,
                });
                dispatchProgressInfo({
                    type: "itemDeleted",
                    checked: checked,
                });

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
                dispatchCheckItems({
                    type: "updateState",
                    stateValue: stateValue,
                    id: checkItem.id,
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
