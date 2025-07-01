import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export default function OracleConfigSection({ form }: { form: any }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-brand">Oracle Configuration</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="updateInterval"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Update Interval (seconds)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="3600" {...field} />
              </FormControl>
              <FormDescription>
                How often the oracle should update prices
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="deviationThreshold"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deviation Threshold (%)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="5" {...field} />
              </FormControl>
              <FormDescription>
                Maximum allowed price deviation before triggering update
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="heartbeat"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Heartbeat (seconds)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="86400" {...field} />
              </FormControl>
              <FormDescription>
                Maximum time between updates before considering stale
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="minAnswer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Minimum Answer</FormLabel>
              <FormControl>
                <Input type="number" placeholder="0" {...field} />
              </FormControl>
              <FormDescription>
                Minimum acceptable oracle answer value
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="maxAnswer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Maximum Answer</FormLabel>
              <FormControl>
                <Input type="number" placeholder="1000000" {...field} />
              </FormControl>
              <FormDescription>
                Maximum acceptable oracle answer value
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
} 