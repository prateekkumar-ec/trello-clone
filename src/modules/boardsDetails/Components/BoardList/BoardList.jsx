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
import config from "../../../../../config";

const apiKey = config.apiKey;
const token = config.token;

function BoardList({ list, getBoardLists }) {
    const [cards, setCards] = useState([]);

    useEffect(() => {
        getCards();
    }, []);

    function getCards() {
        axios(`https://api.trello.com/1/lists/${list.id}/cards?key=${apiKey}&token=${token}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        })
            .then((response) => {
                setCards(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    function archiveList() {
        axios(`https://api.trello.com/1/lists/${list.id}/?closed=true&&key=${apiKey}&token=${token}`, {
            method: "PUT",
        })
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
        axios(`https://api.trello.com/1/cards?&idList=${list.id}&key=${apiKey}&token=${token}`, {
            method: "POST",
            headers: {
                Accept: "application/json",
            },
            params: {
                name: event,
            },
        })
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
                        <Editable defaultValue={list.name} flexBasis={"80%"} width={"100%"}>
                            <EditablePreview width={"300px"} cursor={"pointer"} />
                            <EditableTextarea />
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
                        <Editable onSubmit={createNewCard} placeholder={"Add a card"} defaultValue="">
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
