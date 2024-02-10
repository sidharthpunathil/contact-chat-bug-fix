import React, { useEffect, useState } from "react";
import {
  Form,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  Input,
} from "reactstrap";

// redux action import
import { inviteContact } from "../redux/actions";

// dispatch import
import { useDispatch } from "react-redux";

interface DataTypes {
  email: string | null;
  name: string | null;
  message: string | null;
}

interface InviteContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (data: DataTypes) => void; // Add this line
  userId: string;
}

const InviteContactModal = ({
  isOpen,
  onClose,
  userId,
}: InviteContactModalProps) => {
  const [data, setData] = useState<DataTypes>({
    email: null,
    name: null,
    message: null,
  });

  const [valid, setValid] = useState<boolean>(false);

  const dispatch = useDispatch();

  useEffect(() => {
    setData({
      email: null,
      name: null,
      message: null,
    });
  }, [isOpen]); // Reset form data when the modal is opened

  useEffect(() => {
    setValid(data.email !== null && data.message !== null && data.name !== null);
  }, [data]);

  const onChangeData = (field: keyof DataTypes, value: string) => {
    setData((prevData) => ({
      ...prevData,
      [field]: value === "" ? null : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (valid) {
      console.log('Data to be sent:', data);
      dispatch(inviteContact({ userId, contactData: data }));
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={onClose} tabIndex={-1} centered scrollable>
      <ModalHeader toggle={onClose} className="bg-primary">
        <div className="modal-title-custom text-white font-size-16">
          Create Contact
        </div>
      </ModalHeader>
      <Form onSubmit={handleSubmit}>
        <ModalBody className="p-4">
          <div className="mb-3">
            <Label htmlFor="AddContactModalemail-input" className="form-label">
              Email
            </Label>
            <Input
              type="email"
              className="form-control"
              id="AddContactModalemail-input"
              placeholder="Enter Email"
              value={data["email"] || ""}
              onChange={(e: any) => {
                onChangeData("email", e.target.value);
              }}
            />
          </div>
          <div className="mb-3">
            <Label htmlFor="AddContactModalname-input" className="form-label">
              Name
            </Label>
            <Input
              type="text"
              className="form-control"
              id="AddContactModalname-input"
              placeholder="Enter Name"
              value={data["name"] || ""}
              onChange={(e: any) => {
                onChangeData("name", e.target.value);
              }}
            />
          </div>
          <div className="">
            <Label
              htmlFor="AddContactModal-invitemessage-input"
              className="form-label"
            >
              Invatation Message
            </Label>
            <textarea
              value={data["message"] || ""}
              onChange={(e: any) => {
                onChangeData("message", e.target.value);
              }}
              className="form-control"
              id="AddContactModal-invitemessage-input"
              rows={3}
              placeholder="Enter Message"
            ></textarea>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button type="button" color="link" className="btn" onClick={onClose} aria-label="Close">
            Close
          </Button>
          <Button
            type="submit"
            color="primary"
            disabled={!valid}
            aria-label="Invite"
          >
            Invite
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default InviteContactModal;