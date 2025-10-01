// Quick TypeScript fixes for migration
const fs = require('fs');
const glob = require('glob');

console.log('🔧 Fixing TypeScript errors for database migration...');

// Files to fix
const patterns = [
  'client/components/*.tsx',
  'client/pages/*.tsx'
];

const fixes = [
  // Role enum fixes
  { from: /role === ['"]creator['"]/g, to: 'role === "CREATOR"' },
  { from: /role === ['"]fan['"]/g, to: 'role === "FAN"' },
  { from: /role:\s*['"]creator['"]/g, to: 'role: "CREATOR"' },
  { from: /role:\s*['"]fan['"]/g, to: 'role: "FAN"' },

  // Snake case to camelCase field name fixes
  { from: /\.user_id\b/g, to: '.userId' },
  { from: /\.display_name\b/g, to: '.displayName' },
  { from: /\.subscription_price\b/g, to: '.subscriptionPrice' },
  { from: /\.tip_enabled\b/g, to: '.tipEnabled' },
  { from: /\.media_count\b/g, to: '.mediaCount' },
  { from: /\.subscriber_count\b/g, to: '.subscriberCount' },
  { from: /\.total_earnings\b/g, to: '.totalEarnings' },
  { from: /\.subscription_count\b/g, to: '.subscriptionCount' },
  { from: /\.total_spent\b/g, to: '.totalSpent' },
  { from: /\.is_verified\b/g, to: '.isVerified' },
  { from: /\.created_at\b/g, to: '.createdAt' },
  { from: /\.updated_at\b/g, to: '.updatedAt' },
  { from: /\.is_read\b/g, to: '.isRead' },

  // Object properties in tests and components
  { from: /user_id:/g, to: 'userId:' },
  { from: /display_name:/g, to: 'displayName:' },
  { from: /subscription_price:/g, to: 'subscriptionPrice:' },
  { from: /tip_enabled:/g, to: 'tipEnabled:' },
  { from: /media_count:/g, to: 'mediaCount:' },
  { from: /subscriber_count:/g, to: 'subscriberCount:' },
  { from: /total_earnings:/g, to: 'totalEarnings:' },
  { from: /subscription_count:/g, to: 'subscriptionCount:' },
  { from: /total_spent:/g, to: 'totalSpent:' },
  { from: /is_verified:/g, to: 'isVerified:' },
  { from: /created_at:/g, to: 'createdAt:' },
  { from: /updated_at:/g, to: 'updatedAt:' },
  { from: /is_read:/g, to: 'isRead:' }
];

// Apply fixes to all matching files
patterns.forEach(pattern => {
  const files = glob.sync(pattern);
  files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    fixes.forEach(fix => {
      if (fix.from.test(content)) {
        content = content.replace(fix.from, fix.to);
        changed = true;
      }
    });

    if (changed) {
      fs.writeFileSync(file, content);
      console.log(`✅ Fixed: ${file}`);
    }
  });
});

console.log('🎉 TypeScript migration fixes applied!');
console.log('💡 Run `npm run typecheck` to verify remaining issues.');