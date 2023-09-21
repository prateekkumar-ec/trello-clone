import { List, ListItem, ListIcon } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

import ThreeDots from "../../../../assets/threeDots.svg";
import { useToast, Text, Spinner, Flex, Editable, EditableInput, EditableTextarea, EditablePreview, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";

import "./BoardList.css";
import axios from "axios";
import ListCard from "../ListCard/ListCard";
import { useEffect, useState } from "react";
import config from "../../../../../config";

const apiKey = config.apiKey;
const token = config.token;

function BoardList({ list, boardLists, setBoardLists }) {
    const [cards, setCards] = useState([]);
    const [isCardsLoaded, setIsCardsLoaded] = useState(false);
    const [isError, setIsError] = useState(false);
    const toast = useToast();

    useEffect(() => {
        getCards(list, setCards, setIsCardsLoaded, setIsError);
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
                                <MenuItem onClick={() => archiveList(list, setBoardLists, boardLists)} bg={"#282E33"}>
                                    Archive List
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    </Flex>
                </ListItem>

                {isCardsLoaded ? (
                    cards.map((card) => {
                        return (
                            <ListItem key={card.id}>
                                <ListCard card={card} setCards={setCards} cards={cards}></ListCard>
                            </ListItem>
                        );
                    })
                ) : isError ? (
                    <Text color={"red"} fontSize={"15px"}>
                        Error ! Cards can't be loaded.
                    </Text>
                ) : (
                    <Flex justify={"center"}>
                        <Spinner></Spinner>
                    </Flex>
                )}
                <ListItem>
                    <Flex marginTop={"1rem"} gap={"1rem"} alignItems={"center"}>
                        <AddIcon />
                        <Editable onSubmit={(event) => createNewCard(event, list, cards, setCards, toast)} placeholder={"Add a card"} defaultValue="">
                            <EditablePreview cursor={"pointer"} />
                            <EditableInput />
                        </Editable>
                    </Flex>
                </ListItem>
            </List>
        </div>
    );
}

function getCards(list, setCards, setIsCardsLoaded, setIsError) {
    axios(`https://api.trello.com/1/lists/${list.id}/cards?key=${apiKey}&token=${token}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
    })
        .then((response) => {
            setCards(response.data);
            setIsCardsLoaded(true);
        })
        .catch((error) => {
            setIsError(true);
            console.log(error);
        });
}

function archiveList(list, setBoardLists, boardLists) {
    axios(`https://api.trello.com/1/lists/${list.id}/?closed=true&&key=${apiKey}&token=${token}`, {
        method: "PUT",
    })
        .then((response) => {
            if (response.status == 200) {
                setBoardLists(() => {
                    return boardLists.filter((boardList) => {
                        return boardList.id != list.id;
                    });
                });
            }
        })
        .catch((err) => console.error(err));
}

function createNewCard(event, list, cards, setCards, toast) {
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
            setCards([...cards, response.data]);
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
export default BoardList;
