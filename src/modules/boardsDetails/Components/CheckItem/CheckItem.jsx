import { Checkbox, Flex, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import ThreeDots from "../../../../assets/threeDots.svg";
import axios from "axios";
import { useEffect, useState } from "react";
import config from "../../../../../config";
const { apiKey, token } = config;

function CheckItem({ card, checklist, checkItem, progressInfo, setProgressInfo, getCheckItems }) {
    const [checked, setChecked] = useState(false);
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
        }).then((reponse) => {
            getCheckItems();
        });
    }

    function updateCheckItemState(stateValue) {
        axios(`https://api.trello.com/1/cards/${card.id}/checkItem/${checkItem.id}?key=${apiKey}&token=${token}`, {
            method: "PUT",
            params: {
                state: stateValue,
            },
        })
            .then((response) => {})
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
