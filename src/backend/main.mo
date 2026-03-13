import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Order "mo:core/Order";

actor {
  type Sermon = {
    title : Text;
    speaker : Text;
    date : Time.Time;
    scriptureReference : Text;
    description : Text;
  };

  type Event = {
    title : Text;
    date : Time.Time;
    time : Text;
    location : Text;
    description : Text;
  };

  type ContactSubmission = {
    name : Text;
    email : Text;
    phone : ?Text;
    message : Text;
    timestamp : Time.Time;
  };

  module Sermon {
    public func compare(a : Sermon, b : Sermon) : Order.Order {
      Int.compare(a.date, b.date);
    };
  };

  module Event {
    public func compare(a : Event, b : Event) : Order.Order {
      Int.compare(a.date, b.date);
    };
  };

  // Persistent storage using maps
  let sermons = Map.empty<Text, Sermon>();
  let events = Map.empty<Text, Event>();
  let contactSubmissions = Map.empty<Text, ContactSubmission>();

  // Seed data
  let sermon1 : Sermon = {
    title = "The Power of the Holy Spirit";
    speaker = "Pastor John Abraham";
    date = 1_679_232_000_000_000;
    scriptureReference = "Acts 2:1-4";
    description = "A sermon on the day of Pentecost and the outpouring of the Holy Spirit.";
  };

  let sermon2 : Sermon = {
    title = "Walking in Faith";
    speaker = "Rev. Grace Mathew";
    date = 1_679_977_600_000_000;
    scriptureReference = "Hebrews 11:1-6";
    description = "Exploring what it means to live by faith in Christ.";
  };

  let event1 : Event = {
    title = "Sunday Worship Service";
    date = 1_695_235_600_000_000; // 06/08/2023
    time = "10:00 AM";
    location = "Sanctuary";
    description = "Weekly Sunday worship service with praise, worship, and the Word.";
  };

  let event2 : Event = {
    title = "Youth Revival Night";
    date = 1_696_233_600_000_000; // 27/08/2023
    time = "06:30 PM";
    location = "Youth Hall";
    description = "A night of worship, teaching, and fellowship for our youth ministry.";
  };

  // Initialize map with seed data
  sermons.add(sermon1.title, sermon1);
  sermons.add(sermon2.title, sermon2);
  events.add(event1.title, event1);
  events.add(event2.title, event2);

  public query ({ caller }) func listSermons() : async [Sermon] {
    sermons.values().toArray().sort();
  };

  public query ({ caller }) func listEvents() : async [Event] {
    events.values().toArray().sort();
  };

  public shared ({ caller }) func submitContactForm(name : Text, email : Text, phone : ?Text, message : Text) : async () {
    let submission : ContactSubmission = {
      name;
      email;
      phone;
      message;
      timestamp = Time.now();
    };
    contactSubmissions.add(name.concat(submission.timestamp.toText()), submission);
  };

  public query ({ caller }) func getAllContactSubmissions() : async [ContactSubmission] {
    contactSubmissions.values().toArray();
  };
};
