"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Building2, Users, User } from "lucide-react";
import { useTenant } from "@/app/providers/tenant-provider";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const tenantTypeIcons = {
  individual: User,
  team: Users,
  org: Building2,
};

export function TenantSwitcher() {
  const { tenant, setTenant, tenants } = useTenant();
  const [open, setOpen] = React.useState(false);

  const Icon = tenant ? tenantTypeIcons[tenant.type] : Building2;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <div className="flex items-center gap-2">
            {tenant && <Icon className="h-4 w-4 shrink-0" />}
            <span className="truncate">
              {tenant ? tenant.name : "Select tenant..."}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search tenant..." className="h-9" />
          <CommandList>
            <CommandEmpty>No tenant found.</CommandEmpty>
            <CommandGroup>
              {tenants.map((t) => {
                const TenantIcon = tenantTypeIcons[t.type];
                const isSelected = tenant?.id === t.id;
                return (
                  <CommandItem
                    key={t.id}
                    value={t.name}
                    onSelect={() => {
                      setTenant(t);
                      setOpen(false);
                    }}
                  >
                    <TenantIcon className="mr-2 h-4 w-4 shrink-0" />
                    <span className="flex-1">{t.name}</span>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4 shrink-0",
                        isSelected ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
