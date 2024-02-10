import React, { useContext } from "react";
import classnames from "classnames";
import { MyContactContext } from "../../../ContextShare";
import ContactItem from './ContactItem';
import { constants } from "buffer";

interface CharacterItemProps {
  index: number;
  onSelectChat: (id: string | number, isChannel?: boolean) => void;
}

const CharacterItem = React.memo(({ index, onSelectChat }: CharacterItemProps) => {
  let { contacts } = useContext(MyContactContext);

  return (
    <div className={classnames({ "mt-3": index !== 0 })}>
      <ul className="list-unstyled contact-list">
        {contacts.map((contact: any, key: number) => (
          <div>
          <ContactItem
            key={key} // Add a unique key to each ContactItem
            contact={contact}
            onSelectChat={onSelectChat}
          />
          <div>hahah</div>
          </div>  
        ))}
      </ul>
    </div>
  );
});

export default CharacterItem;
