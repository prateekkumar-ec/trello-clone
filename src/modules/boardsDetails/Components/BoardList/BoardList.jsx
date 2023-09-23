import { List, ListItem, ListIcon } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

import ThreeDots from "../../../../assets/threeDots.svg";
import { useToast, Text, Spinner, Flex, Editable, EditableInput, EditableTextarea, EditablePreview, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";

import "./BoardList.css";
import axios from "axios";
import ListCard from "../ListCard/ListCard";
import { useEffect, useReducer, useState } from "react";
import config from "../../../../../config";

const apiKey = config.apiKey;
const token = config.token;

function BoardList({ list, dispatchBoardLists }) {
    const [cards, dispatchCards] = useReducer(cardsReducer, { data: [], isCardsLoaded: false, isError: false });

    const toast = useToast();

    useEffect(() => {
        axios(`https://api.trello.com/1/lists/${list.id}/cards?key=${apiKey}&token=${token}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        })
            .then((response) => {
                dispatchCards({
                    type: "get",
                    data: response.data,
                });
            })
            .catch((error) => {
                dispatchCards({
                    type: "error",
                    error: error,
                });
            });
    }, []);

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
                                <MenuItem onClick={() => archiveList(list, dispatchBoardLists)} bg={"#282E33"}>
                                    Archive List
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    </Flex>
                </ListItem>

                {cards.isCardsLoaded ? (
                    cards.data.map((card) => {
                        return (
                            <ListItem key={card.id}>
                                <ListCard card={card} dispatchCards={dispatchCards}></ListCard>
                            </ListItem>
                        );
                    })
                ) : cards.isError ? (
                    <Text color={"red"} fontSize={"15px"}>
                        {cards.isError.message}
                    </Text>
                ) : (
                    <Flex justify={"center"}>
                        <Spinner></Spinner>
                    </Flex>
                )}
                <ListItem>
                    <Flex marginTop={"1rem"} gap={"1rem"} alignItems={"center"}>
                        <AddIcon />
                        <Editable onSubmit={(event) => createNewCard(event, list, dispatchCards, toast)} placeholder={"Add a card"} defaultValue="">
                            <EditablePreview cursor={"pointer"} />
                            <EditableInput />
                        </Editable>
                    </Flex>
                </ListItem>
            </List>
        </div>
    );
}

function archiveList(list, dispatchBoardLists) {
    axios(`https://api.trello.com/1/lists/${list.id}/?closed=true&&key=${apiKey}&token=${token}`, {
        method: "PUT",
    })
        .then((response) => {
            if (response.status == 200) {
                dispatchBoardLists({
                    type: "delete",
                    id: list.id,
                });
            }
        })
        .catch((err) => console.error(err));
}

function createNewCard(event, list, dispatchCards, toast) {
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
            dispatchCards({
                type: "add",
                data: response.data,
            });
            toast({
                title: " Created!",
                description: "A new card is created successfully.",
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

function cardsReducer(cards, action) {
    switch (action.type) {
        case "get": {
            return { ...cards, data: action.data, isCardsLoaded: true };
        }
        case "add": {
            return { ...cards, data: [...cards.data, action.data] };
        }
        case "delete": {
            let new_data = cards.data.filter((item) => {
                return item.id != action.id;
            });
            return { ...cards, data: new_data };
        }
        case "error": {
            return { ...cards, isError: action.error };
        }
    }
}
export default BoardList;
