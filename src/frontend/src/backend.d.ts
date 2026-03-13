import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Sermon {
    title: string;
    date: Time;
    description: string;
    scriptureReference: string;
    speaker: string;
}
export type Time = bigint;
export interface ContactSubmission {
    name: string;
    email: string;
    message: string;
    timestamp: Time;
    phone?: string;
}
export interface Event {
    title: string;
    date: Time;
    time: string;
    description: string;
    location: string;
}
export interface backendInterface {
    getAllContactSubmissions(): Promise<Array<ContactSubmission>>;
    listEvents(): Promise<Array<Event>>;
    listSermons(): Promise<Array<Sermon>>;
    submitContactForm(name: string, email: string, phone: string | null, message: string): Promise<void>;
}
