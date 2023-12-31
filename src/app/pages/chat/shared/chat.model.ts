export class ChatTopic {
    id: number;
    name:string;
    topic: string;
    chatId: string;
    userCode: string;
    created: Date;
}

export class ChatEntry {
    id: number;
    topic: string;
    chatId: string;
    content: string;
    userCode: string;
    created: Date;
}

export class ChatTopicCreateRequest {
    topic: string;
    content: string;
}

export class ChatCreateRequest {
    chatId: string;
    topic:string;
    content:string;
}