import DashboardLayout from "@/components/layout/app";
import PageContainer from "@/components/templates/page-container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { useLoaderData } from "react-router-dom";
import React, { useState, useEffect } from "react";

export async function ChatLoader() {
  const response = await fetch("http://localhost:5275/api/Chats");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  return data;
}

export default function ChatPage() {
  const data = useLoaderData();

  // Estado para guardar la conversación seleccionada
  const [selectedConversation, setSelectedConversation] = useState(null);

  // Filtrar mensajes por la conversación seleccionada
  const filteredMessages = selectedConversation
    ? data.filter((msg) => msg.conversacionId === selectedConversation)
    : [];

  // Agrupar mensajes por conversacionId (se mantiene solo un mensaje por conversación)
  const groupedConversations = Array.from(
    new Map(data.map((item) => [item.conversacionId, item])).values()
  );

  return (
    <DashboardLayout>
      <PageContainer scrollable>
        <div className="space-y-4">
          <Breadcrumbs
            items={[
              { title: "Dashboard", link: "/dashboard" },
              { title: "Historial del chat", link: "/chat" },
            ]}
          />

          <div className="flex items-start justify-between">
            <Heading
              description="Información general"
              title="Historial del chat"
            />
          </div>
          <div>
            <div className="flex justify-between gap-x-10 mb-3">
              <Input placeholder="Buscar" />
            </div>
            <div className="flex h-screen overflow-hidden">
              {/* Sidebar */}
              <div className="w-1/4 bg-white border-r border-gray-300">
                {/* Sidebar Header */}
                <div className="p-4 border-b border-gray-300 flex justify-between items-center bg-black text-white">
                  <h1 className="text-2xl font-semibold">Coffee Chat</h1>
                </div>

                {/* Lista de conversaciones */}
                <div className="overflow-y-auto h-screen p-3 mb-9 pb-20">
                  {groupedConversations.map((conversation) => (
                    <div
                      key={conversation.conversacionId}
                      onClick={() =>
                        setSelectedConversation(conversation.conversacionId)
                      }
                      className="flex items-center mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded-md"
                    >
                      <div className="flex-1">
                        <h2 className="text-lg font-semibold">
                          {conversation.conversacionId}
                        </h2>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Área principal del chat */}
              <div className="flex-1">
                {/* Chat Header */}
                <header className="bg-white p-4 text-gray-700">
                  <h1 className="text-2xl font-semibold">
                    {selectedConversation
                      ? selectedConversation
                      : "Selecciona una conversación"}
                  </h1>
                </header>

                {/* Mensajes del chat */}
                <div className="h-screen overflow-y-auto p-4 pb-36 bg-gray-100">
                  {filteredMessages.length > 0 ? (
                    filteredMessages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${
                          message.rol === "user"
                            ? "justify-start"
                            : "justify-end"
                        } mb-4`}
                      >
                        <div
                          className={`flex max-w-96 ${
                            message.rol === "user"
                              ? "bg-white"
                              : "bg-gray-600 text-white"
                          } rounded-lg p-3`}
                        >
                          <p>{message.mensaje}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No hay mensajes en esta conversación</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    </DashboardLayout>
  );
}
