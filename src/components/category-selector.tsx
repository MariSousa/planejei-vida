
'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Search, ChevronRight, Heart, Star, Trash2 } from 'lucide-react';
import { expenseCategoryGroups, getIconForCategory } from '@/lib/categories';
import { type CustomCategory } from '@/types';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CategorySelectorProps {
  customCategories: CustomCategory[];
  favoriteCategories: string[];
  onSelect: (category: string) => void;
  onFavoriteToggle: (category: string, isFavorite: boolean) => void;
  onRemoveCategory: (categoryId: string) => void;
  selectedValue?: string;
}

export function CategorySelector({ 
    customCategories, 
    favoriteCategories, 
    onSelect, 
    onFavoriteToggle,
    onRemoveCategory,
    selectedValue 
}: CategorySelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  const allCategories = useMemo(() => {
    const customGroup = {
      label: 'Personalizadas',
      icon: Star,
      options: customCategories.map(c => ({ id: c.id, name: c.name})),
    };
    const defaultGroups = expenseCategoryGroups.map(group => ({
        ...group,
        options: group.options.map(opt => ({ id: opt, name: opt }))
    }));

    return customCategories.length > 0 ? [...defaultGroups, customGroup] : defaultGroups;
  }, [customCategories]);

  const filteredCategories = useMemo(() => {
    if (!searchTerm) return allCategories;
    
    return allCategories.map(group => {
      const filteredOptions = group.options.filter(option => 
        option.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (filteredOptions.length > 0) {
        return { ...group, options: filteredOptions };
      }
      return null;
    }).filter(Boolean) as typeof allCategories;
  }, [searchTerm, allCategories]);

  const activeGroup = useMemo(() => {
      if (!selectedGroup) return null;
      return allCategories.find(g => g.label === selectedGroup) || null;
  }, [selectedGroup, allCategories]);

  return (
    <Tabs defaultValue="favorites">
      <TabsList className="w-full">
        <TabsTrigger value="favorites" className="w-full">
          <Star className="mr-2" /> Favoritos
        </TabsTrigger>
        <TabsTrigger value="all" className="w-full">Todas</TabsTrigger>
      </TabsList>
      <TabsContent value="favorites">
        <div className="border rounded-lg p-2 min-h-[300px]">
          {favoriteCategories.length > 0 ? (
            <ScrollArea className="h-[280px]">
              <div className="pr-2 space-y-1">
                {favoriteCategories.map(option => {
                    const Icon = getIconForCategory(option);
                    return (
                        <div key={option} className="flex items-center">
                            <Button
                            variant={selectedValue === option ? 'default' : 'ghost'}
                            className="w-full justify-start gap-2"
                            onClick={() => onSelect(option)}
                            >
                                <Icon className="h-4 w-4 text-muted-foreground" />
                                {option}
                            </Button>
                            <Button 
                            variant="ghost" 
                            size="icon" 
                            className="ml-2"
                            onClick={() => onFavoriteToggle(option, true)}
                            >
                            <Heart className="h-4 w-4 text-red-500" fill="currentColor" />
                            </Button>
                        </div>
                    )
                })}
              </div>
            </ScrollArea>
          ) : (
            <div className="flex items-center justify-center h-[280px] text-sm text-muted-foreground">
              <p className="text-center">Você ainda não tem categorias favoritas.<br/>Clique no coração ao lado de uma categoria para adicioná-la.</p>
            </div>
          )}
        </div>
      </TabsContent>
      <TabsContent value="all">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 border rounded-lg p-2 min-h-[300px]">
          {/* Left Panel: Main Categories */}
          <div className="flex flex-col">
            <div className="relative mb-2">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar Categorias" 
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <ScrollArea className="flex-grow h-[260px]">
              <div className="pr-2">
                {filteredCategories.map(group => {
                  const Icon = group.icon;
                  return (
                    <button
                      key={group.label}
                      type="button"
                      onClick={() => setSelectedGroup(group.label)}
                      className={cn(
                        "w-full flex items-center justify-between p-2 text-sm rounded-md text-left",
                        selectedGroup === group.label ? "bg-accent text-accent-foreground" : "hover:bg-muted"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                        <span>{group.label}</span>
                      </div>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  )
                })}
              </div>
            </ScrollArea>
          </div>

          {/* Right Panel: Subcategories */}
          <div className="border-l pl-2">
            <ScrollArea className="h-full max-h-[300px]">
                <div className="pr-2">
                    {activeGroup ? (
                        <>
                            <h3 className="font-semibold mb-2 p-2">{activeGroup.label}</h3>
                            {activeGroup.options.map(option => {
                                const isFavorite = favoriteCategories.includes(option.name);
                                const isCustom = activeGroup.label === 'Personalizadas';
                                const Icon = getIconForCategory(option.name);
                                return (
                                    <div key={option.id} className="flex items-center group/item">
                                        <Button
                                            variant={selectedValue === option.name ? 'default' : 'ghost'}
                                            className="w-full justify-start gap-2"
                                            onClick={() => onSelect(option.name)}
                                        >
                                            <Icon className="h-4 w-4 text-muted-foreground" />
                                            {option.name}
                                        </Button>
                                        
                                        {isCustom ? (
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="ml-2"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onRemoveCategory(option.id)
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        ) : (
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="ml-2"
                                                onClick={() => onFavoriteToggle(option.name, isFavorite)}
                                            >
                                                <Heart className={cn("h-4 w-4", isFavorite && "text-red-500 fill-current")} />
                                            </Button>
                                        )}
                                    </div>
                                )
                            })}
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                            <p>Selecione um grupo à esquerda</p>
                        </div>
                    )}
                </div>
            </ScrollArea>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
