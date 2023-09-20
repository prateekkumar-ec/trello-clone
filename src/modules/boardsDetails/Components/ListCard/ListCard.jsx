import {
    Text,
    Modal,
    ModalOverlay,
    ModalContent,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    Flex,
} from "@chakra-ui/react";
import { EditIcon, CheckIcon, AddIcon } from "@chakra-ui/icons";
import axios from "axios";
import CheckListIcon from "../../../../assets/checklistIcon.svg";
import CardDetails from "../CardDetails/CardDetails";
import config from "../../../../../config";

const apiKey = config.apiKey;
const token = config.token;
function ListCard({ card, getCards }) {
    const { isOpen, onOpen, onClose } = useDisclosure();

    function deleteCard() {
        axios(`https://api.trello.com/1/cards/${card.id}?key=${apiKey}&token=${token}`, {
            method: "DELETE",
        })
            .then((response) => {
                getCards();
            })
            .catch((error) => {
                console.log(error);
            });
    }

    return (
        <>
            <Flex marginTop={"0.6rem"}>
                <Flex justifyContent={"space-between"} alignItems={"center"} width={"100%"}>
                    <Button flexBasis={"100%"} fontSize={"1rem"} bg={"#282E33"} onClick={onOpen} color={"#818B95"} justifyContent={"flex-start"}>
                        <Text>{card.name}</Text>
                    </Button>
                    <Menu>
                        <MenuButton background={"#282E3"} as={Button} rightIcon={<EditIcon color={"#818B95"} />}></MenuButton>
                        <MenuList background={"#282E33"}>
                            <MenuItem onClick={deleteCard} background={"none"}>
                                Delete
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </Flex>
            </Flex>

            <Modal isOpen={isOpen} onClose={onClose} size={"3xl"}>
                <ModalOverlay />
                <ModalContent background={"#323940"}>
                    <ModalHeader color={"white"}>{card.name}</ModalHeader>
                    <ModalCloseButton color={"white"} />
                    <ModalBody color={"white"}>
                        <CardDetails card={card} />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}

export default ListCard;
