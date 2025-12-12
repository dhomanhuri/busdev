"use client";

import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface DraggableWidgetProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  isStats?: boolean;
}

function DraggableWidget({ id, children, className, isStats }: DraggableWidgetProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn("relative group", className)}
    >
      <div
        {...attributes}
        {...listeners}
        className="absolute -left-2 top-2 z-10 cursor-grab active:cursor-grabbing p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-sm"
      >
        <GripVertical className="h-4 w-4 text-slate-500 dark:text-slate-400" />
      </div>
      {children}
    </div>
  );
}

interface WidgetItem {
  id: string;
  type: "stats" | "chart" | "list";
}

interface DraggableDashboardProps {
  statsCards: React.ReactNode[];
  charts: React.ReactNode[];
  lists: React.ReactNode[];
}

export function DraggableDashboard({
  statsCards,
  charts,
  lists,
}: DraggableDashboardProps) {
  const [items, setItems] = useState<WidgetItem[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Initialize items from localStorage or default order
  useEffect(() => {
    const savedLayout = localStorage.getItem("dashboard-layout");
    if (savedLayout) {
      try {
        const parsed = JSON.parse(savedLayout);
        // Validate that all items exist
        const allItems: WidgetItem[] = [
          ...statsCards.map((_, i) => ({ id: `stats-${i}`, type: "stats" as const })),
          ...charts.map((_, i) => ({ id: `chart-${i}`, type: "chart" as const })),
          ...lists.map((_, i) => ({ id: `list-${i}`, type: "list" as const })),
        ];
        
        // Filter to only include valid items
        const validItems = parsed.filter((item: WidgetItem) =>
          allItems.some((ai) => ai.id === item.id)
        );
        
        // Add any missing items
        const missingItems = allItems.filter(
          (ai) => !validItems.some((vi: WidgetItem) => vi.id === ai.id)
        );
        
        setItems([...validItems, ...missingItems]);
      } catch (e) {
        // If parsing fails, use default
        setItems([
          ...statsCards.map((_, i) => ({ id: `stats-${i}`, type: "stats" as const })),
          ...charts.map((_, i) => ({ id: `chart-${i}`, type: "chart" as const })),
          ...lists.map((_, i) => ({ id: `list-${i}`, type: "list" as const })),
        ]);
      }
    } else {
      // Default order
      setItems([
        ...statsCards.map((_, i) => ({ id: `stats-${i}`, type: "stats" as const })),
        ...charts.map((_, i) => ({ id: `chart-${i}`, type: "chart" as const })),
        ...lists.map((_, i) => ({ id: `list-${i}`, type: "list" as const })),
      ]);
    }
  }, [statsCards.length, charts.length, lists.length]);

  // Save to localStorage whenever items change
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem("dashboard-layout", JSON.stringify(items));
    }
  }, [items]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  const renderWidget = (item: WidgetItem) => {
    if (item.type === "stats") {
      const index = parseInt(item.id.split("-")[1]);
      return statsCards[index];
    } else if (item.type === "chart") {
      const index = parseInt(item.id.split("-")[1]);
      return charts[index];
    } else if (item.type === "list") {
      const index = parseInt(item.id.split("-")[1]);
      return lists[index];
    }
    return null;
  };

  // Separate stats from other widgets for display
  const statsItems = items.filter((item) => item.type === "stats");
  const otherItems = items.filter((item) => item.type !== "stats");

  return (
    <div className="space-y-6">
      {/* Edit Mode Toggle */}
      <div className="flex justify-end">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={cn(
            "px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm",
            isEditing
              ? "bg-orange-500 text-white hover:bg-orange-600"
              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
          )}
        >
          {isEditing ? "✓ Done Editing" : "✎ Edit Layout"}
        </button>
      </div>

      {isEditing && (
        <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3 text-sm text-orange-800 dark:text-orange-200">
          💡 Drag widgets by clicking and holding the grip icon that appears on hover
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        {/* Stats Cards Row - Can drag within stats */}
        <SortableContext items={statsItems.map((item) => item.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsItems.map((item) => (
              <DraggableWidget
                key={item.id}
                id={item.id}
                isStats={true}
                className={cn(
                  isEditing && "ring-2 ring-orange-500 ring-offset-2 rounded-xl"
                )}
              >
                {renderWidget(item)}
              </DraggableWidget>
            ))}
          </div>
        </SortableContext>

        {/* Charts and Lists - Can drag within charts/lists */}
        <SortableContext items={otherItems.map((item) => item.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {otherItems.map((item) => (
              <DraggableWidget
                key={item.id}
                id={item.id}
                className={cn(
                  isEditing && "ring-2 ring-orange-500 ring-offset-2 rounded-xl"
                )}
              >
                {renderWidget(item)}
              </DraggableWidget>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
