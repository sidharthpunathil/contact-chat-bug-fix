import { useState } from "react";
import classnames from "classnames";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

interface ContactItemProps {
  contact: any;
  onSelectChat: (id: string | number, isChannel?: boolean) => void;
}

const ContactItem = ({ contact, onSelectChat }: ContactItemProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen(!dropdownOpen);
  const fullName = `${contact.name}`;
  const shortName = contact.name ? contact.name.charAt(0) : 'N/A';
  const colors = [
    "bg-primary",
    "bg-danger",
    "bg-info",
    "bg-warning",
    "bg-secondary",
    "bg-pink",
    "bg-purple",
  ];
  const [color] = useState(Math.floor(Math.random() * colors.length));

  return (
    <li onClick={() => onSelectChat(contact.id)}>
      <div className="d-flex align-items-center">
        <div className="flex-shrink-0 me-2">
          <div className="avatar-xs">
            {contact.profileImage ? (
              <img
                src={contact.profileImage}
                alt=""
                className="img-fluid rounded-circle"
              />
            ) : (
              <span
                className={classnames(
                  "avatar-title",
                  "rounded-circle",
                  "font-size-10",
                  "text-uppercase",
                  colors[color]
                )}
              >
                {shortName}
              </span>
            )}
          </div>
        </div>
        <div className="flex-grow-1">
          <h5 className="font-size-14 m-0">{fullName}</h5>
        </div>

        <div className="flex-shrink-0">
          <Dropdown isOpen={dropdownOpen} toggle={toggle}>
            <DropdownToggle tag="a" className="text-mute">
              <i className="bx bx-dots-vertical-rounded align-middle"></i>
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-end">
              <DropdownItem
                className="d-flex align-items-center justify-content-between"
                href="#"
              >
                Edit <i className="bx bx-pencil ms-2 text-muted"></i>
              </DropdownItem>
              <DropdownItem
                className="d-flex align-items-center justify-content-between"
                href="#"
              >
                Block <i className="bx bx-block ms-2 text-muted"></i>
              </DropdownItem>
              <DropdownItem
                className="d-flex align-items-center justify-content-between"
                href="#"
              >
                Remove <i className="bx bx-trash ms-2 text-muted"></i>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      
    </li>
  );
};

export default ContactItem;