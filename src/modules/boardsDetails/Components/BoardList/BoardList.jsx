import { List, ListItem, ListIcon } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

import ThreeDots from "../../../../assets/threeDots.svg";
import {
    Flex,
    Editable,
    EditableInput,
    EditableTextarea,
    EditablePreview,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuDivider,
    Button,
} from "@chakra-ui/react";

import "./BoardList.css";
import axios from "axios";
import ListCard from "../ListCard/ListCard";
import { useEffect, useState } from "react";

function BoardList({ list, getBoardLists }) {
    const [cards, setCards] = useState([]);

    useEffect(() => {
        getCards();
    }, []);

    function getCards() {
        axios(
            `https://api.trello.com/1/lists/${list.id}/cards?key=4eec852d0aa570f6b51d0e9a2a58356e&token=ATTA4e4e36552ff74519e3fbed4812cdbd67a2aea1d95f113ef01ed800d6408e03b6A8776DBB`,
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                },
            }
        )
            .then((response) => {
                setCards(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    function archiveList() {
        axios(
            `https://api.trello.com/1/lists/${list.id}/?closed=true&&key=4eec852d0aa570f6b51d0e9a2a58356e&token=ATTA4e4e36552ff74519e3fbed4812cdbd67a2aea1d95f113ef01ed800d6408e03b6A8776DBB`,
            {
                method: "PUT",
            }
        )
            .then((response) => {
                if (response.status == 200) {
                    getBoardLists();
                }
            })
            .catch((err) => console.error(err));
        // console.log(list.id);
    }

    function createNewCard(event) {
        if (event == "") {
            return;
        }
        axios(
            `https://api.trello.com/1/cards?&idList=${list.id}&key=4eec852d0aa570f6b51d0e9a2a58356e&token=ATTA4e4e36552ff74519e3fbed4812cdbd67a2aea1d95f113ef01ed800d6408e03b6A8776DBB`,
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                },
                params: {
                    name: event,
                },
            }
        )
            .then((response) => {
                getCards();
            })
            .catch((error) => {
                console.log(error);
            });
    }

    return (
        <div className="board-list">
            <List background="#101204" color="white" padding={"1rem"} borderRadius={"7px"} alignSelf={"flex-start"}>
                <ListItem>
                    <Flex justify={"space-between"}>
                        <Editable defaultValue={list.name}>
                            <EditablePreview cursor={"pointer"} />
                            <EditableInput />
                        </Editable>
                        <Menu>
                            <MenuButton>
                                <img src={ThreeDots}></img>
                            </MenuButton>
                            <MenuList bgColor={"#282E33"}>
                                <MenuItem onClick={archiveList} bg={"#282E33"}>
                                    Archive List
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    </Flex>
                </ListItem>

                {cards.map((card) => {
                    return (
                        <ListItem key={card.id}>
                            <ListCard card={card} getCards={getCards}></ListCard>
                        </ListItem>
                    );
                })}
                <ListItem>
                    <Flex marginTop={"1rem"} gap={"1rem"} alignItems={"center"}>
                        <AddIcon />
                        <Editable onSubmit={createNewCard} placeholder={"Add another list"} defaultValue="">
                            <EditablePreview cursor={"pointer"} />
                            <EditableInput />
                        </Editable>
                    </Flex>
                </ListItem>
            </List>
        </div>
    );
}

export default BoardList;
// https://api.trello.com/1/lists/6507d65c2ef228c851e96ed3/closed?key=4eec852d0aa570f6b51d0e9a2a58356e&token=ATTA4e4e36552ff74519e3fbed4812cdbd67a2aea1d95f113ef01ed800d6408e03b6A8776DBB
