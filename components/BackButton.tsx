"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

const BackButton = () => {
  const pathname = usePathname(); // Get current route

  // Don't render the button if we're on the home page
  if (pathname === "/") return null;

  return (
    <div className="ml-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Home
        </Link>
      </Button>
    </div>
  );
};

export default BackButton;
