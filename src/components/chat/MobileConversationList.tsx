import { FC, useEffect, useState } from "react";
import { MobileMenu } from "../layout/MobileMenu";
import ConversationList from "./ConversationList";
import { useChat } from "@/contexts/chat.context";

export const MobileConversationList: FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { curConversation } = useChat();
  useEffect(() => {
    if (curConversation) setMobileMenuOpen(false);
  }, [curConversation]);
  return (
    <MobileMenu isOpen={mobileMenuOpen} setIsOpen={setMobileMenuOpen}>
      <ConversationList />
    </MobileMenu>
  );
};
