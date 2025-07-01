import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export default function StakeSection({ form }: { form: any }) {
  return (
    <FormField
      control={form.control}
      name="stake"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Stake Amount</FormLabel>
          <FormControl>
            <Input type="number" placeholder="1" {...field} />
          </FormControl>
          <FormDescription>
            Stake USDC as collateral for any damages or misbehavior
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
} 