# Database Seeding Instructions

This project includes a seed script to populate the database with sample data for development and testing.

## What Gets Seeded

The seed script creates the following data:

- **1 User** (Admin account)
  - Email: `admin@admin.com`
  - Password: `123456`
  - Role: Admin

- **5 Tags**: Heritage, Festival, Tradition, Culture, Art

- **5 Post Types**: Article, Story, Guide, Interview, Documentary

- **5 Post Groups**: Travel Guide, Local Stories, Art & Craft, Food & Cuisine, Historical Events

- **5 Locations**: Udupi Beach, Kundapura Temple, Barkur Fort, Malpe Beach, Jomlu Bazaar

- **5 Cultures**: Tulunad Heritage, Yakshagana Tradition, Temple Architecture, Traditional Cuisine, Artisan Crafts

- **5 Posts**: Each linked to different cultures, post types, post groups, tags, and locations

- **5 Events**: Upcoming events with dates and locations

## Running the Seed Script

### Prerequisites

Make sure your `.env` file has the `MONGO_URI` set correctly:

```bash
MONGO_URI=mongodb://localhost:27017/satyabolpu
```

### Commands

**Run the seed script:**

```bash
npm run seed
```

Or directly with tsx:

```bash
tsx seeds/index.ts
```

### What It Does

1. Connects to MongoDB
2. **Clears all existing data** in these collections:
   - Users
   - Tags
   - PostTypes
   - PostGroups
   - Locations
   - Cultures
   - Posts
   - Events

3. Creates fresh seed data

4. Displays a summary of all created records

## Important Notes

⚠️ **Warning**: The seed script **clears the entire database** before seeding. Use with caution in production!

If you want to keep existing data, comment out the `clearDatabase()` call in the `main()` function.

## Modifying Seed Data

Edit `seeds/index.ts` to:

- Change user details
- Add more posts, events, cultures, etc.
- Modify location coordinates
- Update image URLs to real images

## Example Output

```
✓ Connected to MongoDB

🧹 Clearing database...
✓ Database cleared

👤 Creating user...
✓ User created: 507f1f77bcf86cd799439011

🏷️  Creating tags...
✓ Created 5 tags

📝 Creating post types...
✓ Created 5 post types

📚 Creating post groups...
✓ Created 5 post groups

📍 Creating locations...
✓ Created 5 locations

🎭 Creating cultures...
✓ Created 5 cultures

📄 Creating posts...
✓ Created 5 posts

📅 Creating events...
✓ Created 5 events

✅ Database seeding completed successfully!

📊 Summary:
   Users: 1
   Tags: 5
   Post Types: 5
   Post Groups: 5
   Locations: 5
   Cultures: 5
   Posts: 5
   Events: 5

📝 User Details:
   ID: 507f1f77bcf86cd799439011
   Email: admin@admin.com
   Password: 123456
```
