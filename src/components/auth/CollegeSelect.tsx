
import { useState, useEffect } from 'react';
import { useAppStore, College } from '@/store/store';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CheckIcon, ChevronsUpDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockColleges } from '@/data/mockColleges';

interface CollegeSelectProps {
  programLevel: 'undergraduate' | 'postgraduate';
  selectedCollege: College | null;
  onSelectCollege: (college: College | null) => void;
  disabled?: boolean;
}

const CollegeSelect = ({
  programLevel,
  selectedCollege,
  onSelectCollege,
  disabled = false
}: CollegeSelectProps) => {
  const { colleges, setColleges, fetchingColleges, setFetchingColleges } = useAppStore();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchColleges = async () => {
      setFetchingColleges(true);
      
      try {
        // In a real app, this would be an API call
        // For now, we'll simulate a network request with our mock data
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const filteredColleges = mockColleges.filter(
          college => college.level === programLevel
        );
        
        setColleges(filteredColleges);
      } catch (error) {
        console.error('Failed to fetch colleges:', error);
        setColleges([]);
      } finally {
        setFetchingColleges(false);
      }
    };

    fetchColleges();
  }, [programLevel, setColleges, setFetchingColleges]);

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-background"
            disabled={disabled || fetchingColleges}
          >
            {fetchingColleges ? (
              <div className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Loading colleges...</span>
              </div>
            ) : selectedCollege ? (
              selectedCollege.name
            ) : (
              "Select college..."
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search colleges..." />
            <CommandList>
              <CommandEmpty>No college found.</CommandEmpty>
              <CommandGroup>
                {colleges.map((college) => (
                  <CommandItem
                    key={college.id}
                    value={college.id}
                    onSelect={() => {
                      onSelectCollege(college.id === selectedCollege?.id ? null : college);
                      setOpen(false);
                    }}
                  >
                    <CheckIcon
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedCollege?.id === college.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {college.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CollegeSelect;
