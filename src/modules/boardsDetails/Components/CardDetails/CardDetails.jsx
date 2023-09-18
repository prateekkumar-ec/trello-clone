import {
    Text,
    Modal,
    ModalOverlay,
    ModalContent,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuDivider,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    Flex,
    List,
    Editable,
    EditablePreview,
    EditableInput,
} from "@chakra-ui/react";
import { EditIcon, CheckIcon, AddIcon } from "@chakra-ui/icons";
import axios from "axios";
import { useEffect, useState } from "react";

function CardDetails({ card }) {
    const [checklists, setChecklists] = useState();
    const [isChecklistLoaded, setIsChecklistLoaded] = useState(false);
    useEffect(() => {
        getCheckLists();
    }, []);
    function getCheckLists() {
        axios(
            `https://api.trello.com/1/cards/${card.id}/checklists?key=4eec852d0aa570f6b51d0e9a2a58356e&token=ATTA4e4e36552ff74519e3fbed4812cdbd67a2aea1d95f113ef01ed800d6408e03b6A8776DBB`,
            { method: "GET" }
        )
            .then((response) => {
                setChecklists(response.data);
                setIsChecklistLoaded(true);
            })
            .catch((error) => {
                console.log(error);
            });
    }
    function createCheckList(name) {
        axios(
            `https://api.trello.com/1/checklists?idCard=${card.id}&key=4eec852d0aa570f6b51d0e9a2a58356e&token=ATTA4e4e36552ff74519e3fbed4812cdbd67a2aea1d95f113ef01ed800d6408e03b6A8776DBB`,
            {
                method: "POST",
                params: {
                    name: name,
                },
            }
        )
            .then((response) => {
                console.log(response);
                getCheckLists();
            })
            .catch((error) => {
                console.log(error);
            });
    }
    if (isChecklistLoaded) {
        return (
            <Flex justify={"space-between"} paddingBottom={"2rem"}>
                <Flex direction={"column"} gap={"2rem"}>
                    {checklists.map((checklist) => {
                        return (
                            <Flex key={checklist.id} gap={"1rem"} className="checklist-header" align={"center"}>
                                <CheckIcon></CheckIcon>
                                <Text>{checklist.name}</Text>
                            </Flex>
                        );
                    })}
                </Flex>

                <Flex direction={"column"}>
                    <Text>Add to card</Text>
                    <Menu>
                        <MenuButton as={Button}>
                            <Flex gap={"1rem"} align={"center"}>
                                <CheckIcon></CheckIcon>
                                <Text>Checklist</Text>
                            </Flex>
                        </MenuButton>
                        <MenuList padding={"1rem"}>
                            <Flex marginLeft={"1rem"} gap={"1rem"} alignItems={"center"}>
                                <AddIcon />
                                <Editable onSubmit={createCheckList} placeholder={"Add checklist"} defaultValue="">
                                    <EditablePreview cursor={"pointer"} />
                                    <EditableInput />
                                </Editable>
                            </Flex>
                        </MenuList>
                    </Menu>
                </Flex>
            </Flex>
        );
    }
}
export default CardDetails;
