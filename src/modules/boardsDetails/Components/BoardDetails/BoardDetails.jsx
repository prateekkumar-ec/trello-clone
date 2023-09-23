import { useEffect, useState, useReducer } from "react";
import { useParams } from "react-router-dom";
import { Flex, Spinner, useToast, Editable, EditableInput, Text, EditablePreview, List } from "@chakra-ui/react";

import BoardList from "../BoardList/BoardList";
import { AddIcon } from "@chakra-ui/icons";
import "./BoardDetails.css";
import config from "../../../../../config";

const apiKey = config.apiKey;
const token = config.token;

import axios from "axios";

function BoardDetails() {
    const toast = useToast();
    const { id, boardName } = useParams();

    const [boardLists, dispatchBoardLists] = useReducer(boardListsReducer, [{ data: [], isListsLoaded: false, isError: false }]);

    const [boardImage, setBoardImage] = useState();

    useEffect(() => {
        axios(`https://api.trello.com/1/boards/${id}/lists?key=${apiKey}&token=${token}`, {
            method: "GET",
        })
            .then((res) => {
                dispatchBoardLists({
                    type: "get",
                    data: res.data,
                });
            })
            .catch((error) => {
                dispatchBoardLists({
                    type: "error",
                    error: error,
                });
            });
        getBoardImage(id, setBoardImage);
    }, []);

    if (boardLists.isListsLoaded) {
        return (
            <>
                <div className="board-bg-container" style={{ backgroundImage: boardImage }}>
                    <div className="">
                        <Flex justify={"space-between"} background={"#0000003d"} padding={"0.8rem 0;"} align={"center"} backdropFilter={"blur(4px)"}>
                            <Flex className="right-bar" align={"center"} gap={"1rem"} marginLeft={"1rem"}>
                                <Text color={"#FFFFFF"} fontSize={"18px"} fontWeight={"bold"}>
                                    {boardName}
                                </Text>
                            </Flex>
                        </Flex>
                    </div>
                    <div className={"board-lists-flex"}>
                        {boardLists.data.map((list) => {
                            return <BoardList key={list.id} list={list} boardLists={boardLists} dispatchBoardLists={dispatchBoardLists}></BoardList>;
                        })}
                        <div className="board-list">
                            <List background="#485F6C" color="#172B4D" padding={"1rem"} borderRadius={"7px"}>
                                <Flex gap={"1rem"} alignItems={"center"}>
                                    <AddIcon />
                                    <Editable onSubmit={(event) => createNewList(event, id, dispatchBoardLists, toast)} submitOnBlur={false} placeholder={"Add another list"}>
                                        <EditablePreview cursor={"pointer"} />
                                        <EditableInput />
                                    </Editable>
                                </Flex>
                            </List>
                        </div>
                    </div>
                </div>
            </>
        );
    } else {
        return (
            <>
                <Flex className={"boards-flex"} width="60%" margin="auto" gap="1.5rem" marginTop={"15rem"} justify={"center"}>
                    {boardLists.isError ? <Text color={"white"}>{boardLists.isError.message}</Text> : <Spinner color="white"></Spinner>}
                </Flex>
            </>
        );
    }
}

function getBoardImage(id, setBoardImage) {
    axios(`https://api.trello.com/1/boards/${id}?key=${apiKey}&token=${token}`, {
        method: "GET",
    })
        .then((res) => {
            if (res.data.prefs.backgroundImageScaled != null) {
                let url = "url(" + res.data.prefs.backgroundImageScaled[8].url + ")";
                setBoardImage(url);
            } else {
                setBoardImage(res.data.prefs.backgroundColor);
            }
        })
        .catch((error) => {
            console.log(error);
        });
}

function createNewList(event, id, dispatchBoardLists, toast) {
    if (event == "") {
        return;
    }
    axios(
        `https://api.trello.com/1/lists?name=${event}&idBoard=${id}&key=4eec852d0aa570f6b51d0e9a2a58356e&token=ATTA4e4e36552ff74519e3fbed4812cdbd67a2aea1d95f113ef01ed800d6408e03b6A8776DBB`,
        {
            method: "POST",
        }
    )
        .then((response) => {
            dispatchBoardLists({
                type: "add",
                data: response.data,
            });
            toast({
                title: " Created!",
                description: "A new list is created successfully.",
                status: "success",
                duration: 9000,
                isClosable: true,
            });
        })
        .catch((err) => {
            toast({
                title: "Failed to create list.",
                description: "Try checking your network.",
                status: "error",
                duration: 9000,
                isClosable: true,
            });
        });
}

function boardListsReducer(boardLists, action) {
    switch (action.type) {
        case "get": {
            return { ...boardLists, data: action.data, isListsLoaded: true };
        }
        case "add": {
            return { ...boardLists, data: [...boardLists.data, action.data] };
        }
        case "delete": {
            let new_data = boardLists.data.filter((boardList) => {
                return boardList.id != action.id;
            });
            return { ...boardLists, data: new_data };
        }
        case "error": {
            return { ...boardLists, isError: action.error };
        }
    }
}
export default BoardDetails;
