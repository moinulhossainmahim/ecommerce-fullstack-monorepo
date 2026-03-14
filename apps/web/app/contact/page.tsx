"use client";

import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Button, Input, Label, Textarea } from "@aurum/shared/ui";
import StoreFooter from "@/components/StoreFooter";

export default function Contact() {
  return (
    <>
      <div className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-display font-semibold text-foreground mb-2">
          Contact Us
        </h1>
        <p className="text-muted-foreground mb-12">
          We&apos;d love to hear from you. Reach out anytime.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="glass-card rounded-lg p-8">
            <h2 className="text-xl font-display font-medium text-foreground mb-6">
              Send a Message
            </h2>
            <form className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input placeholder="John" className="bg-secondary border-none" />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input placeholder="Doe" className="bg-secondary border-none" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="john@example.com"
                  className="bg-secondary border-none"
                />
              </div>
              <div className="space-y-2">
                <Label>Subject</Label>
                <Input
                  placeholder="How can we help?"
                  className="bg-secondary border-none"
                />
              </div>
              <div className="space-y-2">
                <Label>Message</Label>
                <Textarea
                  placeholder="Your message..."
                  className="bg-secondary border-none min-h-[120px]"
                />
              </div>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Send Message
              </Button>
            </form>
          </div>

          {/* Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-display font-medium text-foreground mb-6">
                Get in Touch
              </h2>
              <div className="space-y-5">
                {[
                  {
                    icon: Mail,
                    label: "Email",
                    value: "hello@aurum.com",
                  },
                  {
                    icon: Phone,
                    label: "Phone",
                    value: "+1 (555) 123-4567",
                  },
                  {
                    icon: MapPin,
                    label: "Address",
                    value: "123 Luxury Avenue, Suite 500\nNew York, NY 10001",
                  },
                  {
                    icon: Clock,
                    label: "Hours",
                    value: "Mon — Fri: 9AM — 6PM EST\nSat — Sun: 10AM — 4PM EST",
                  },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                      <item.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {item.label}
                      </p>
                      <p className="text-sm text-muted-foreground whitespace-pre-line">
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-lg p-6">
              <h3 className="text-foreground font-medium mb-2">
                VIP Concierge
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                For our VIP members, we offer dedicated concierge support for
                personalized shopping assistance, gift curation, and priority
                service.
              </p>
              <Button variant="outline" size="sm">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
      <StoreFooter />
    </>
  );
}
