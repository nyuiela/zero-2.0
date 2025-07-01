import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export default function ArgumentsSection({ form, addArg }: { form: any, addArg: () => void }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-brand">Arguments</h3>
        <Button type="button" variant="outline" size="sm" onClick={addArg}>
          Add Argument
        </Button>
      </div>
      <FormField
        control={form.control}
        name="args"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Arguments (comma-separated)</FormLabel>
            <FormControl>
              <Textarea placeholder="arg1, arg2, arg3" className="min-h-[80px]" {...field} />
            </FormControl>
            <FormDescription>
              Additional arguments for the oracle request (comma-separated)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
} 