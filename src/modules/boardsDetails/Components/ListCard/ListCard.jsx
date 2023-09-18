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
import CheckListIcon from "../../../../assets/checklistIcon.svg";
import CardDetails from "../CardDetails/CardDetails";

function ListCard({ card, getCards }) {
    const { isOpen, onOpen, onClose } = useDisclosure();

    function deleteCard() {
        axios(`https://api.trello.com/1/cards/${card.id}?key=4eec852d0aa570f6b51d0e9a2a58356e&token=ATTA4e4e36552ff74519e3fbed4812cdbd67a2aea1d95f113ef01ed800d6408e03b6A8776DBB`, {
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
                    <Button flexBasis={"100%"} fontSize={"1rem"} bg={"#282E33"} onClick={onOpen} flexBasis={"100%"} color={"#818B95"} justifyContent={"flex-start"}>
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

            <Modal isOpen={isOpen} onClose={onClose} size={"3xl"} colorScheme={"#323940"}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{card.name}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <CardDetails card={card} />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}

export default ListCard;
