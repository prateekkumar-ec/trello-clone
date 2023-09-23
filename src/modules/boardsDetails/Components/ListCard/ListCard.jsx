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
    useToast,
} from "@chakra-ui/react";
import { EditIcon, CheckIcon, AddIcon } from "@chakra-ui/icons";
import axios from "axios";
import CheckListIcon from "../../../../assets/checklistIcon.svg";
import CardDetails from "../CardDetails/CardDetails";
import config from "../../../../../config";

const apiKey = config.apiKey;
const token = config.token;
function ListCard({ card, dispatchCards }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

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
                            <MenuItem onClick={() => deleteCard(card, dispatchCards, toast)} background={"none"}>
                                Delete
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </Flex>
            </Flex>

            <Modal isOpen={isOpen} onClose={onClose} size={"3xl"}>
                <ModalOverlay />
                <ModalContent background={"#323940"} color={"#B6C2CF"}>
                    <ModalHeader className="card-header">{card.name}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <CardDetails card={card} />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}
function deleteCard(card, dispatchCards, toast) {
    axios(`https://api.trello.com/1/cards/${card.id}?key=${apiKey}&token=${token}`, {
        method: "DELETE",
    })
        .then((response) => {
            dispatchCards({
                type: "delete",
                id: card.id,
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
export default ListCard;
