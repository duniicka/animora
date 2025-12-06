const mongoose = require('mongoose');
const Pet = require('./models/Pet');

const fixTemperamentData = async () => {
  try {
    // Connect to MongoDB - use 127.0.0.1 instead of localhost
    await mongoose.connect('mongodb://127.0.0.1:27017/Animora');
    console.log('✅ Connected to MongoDB');

    // Get all pets
    const pets = await Pet.find();
    console.log(`\n📊 Found ${pets.length} pets\n`);

    let fixedCount = 0;

    for (const pet of pets) {
      console.log(`\n🐾 Pet: ${pet.name}`);
      console.log(`   Current temperament:`, JSON.stringify(pet.temperament));

      let needsUpdate = false;
      let newTemperament = [];

      if (Array.isArray(pet.temperament)) {
        // Process each item in the array
        for (const item of pet.temperament) {
          if (typeof item === 'string') {
            // Check if it's a JSON string
            if (item.startsWith('[') || item.startsWith('"')) {
              try {
                const parsed = JSON.parse(item);
                if (Array.isArray(parsed)) {
                  newTemperament.push(...parsed);
                } else {
                  newTemperament.push(parsed);
                }
                needsUpdate = true;
              } catch (e) {
                // Not JSON, keep as is
                newTemperament.push(item);
              }
            } else {
              newTemperament.push(item);
            }
          } else {
            newTemperament.push(item);
          }
        }
      } else if (typeof pet.temperament === 'string') {
        // If it's a string, try to parse it
        try {
          const parsed = JSON.parse(pet.temperament);
          newTemperament = Array.isArray(parsed) ? parsed : [parsed];
          needsUpdate = true;
        } catch (e) {
          // Not JSON, split by comma
          newTemperament = pet.temperament.split(',').map(t => t.trim()).filter(t => t);
          needsUpdate = true;
        }
      }

      if (needsUpdate && newTemperament.length > 0) {
        pet.temperament = newTemperament;
        await pet.save();
        fixedCount++;
        console.log(`   ✅ Fixed to:`, newTemperament);
      } else {
        console.log(`   ✓ Already correct or empty`);
      }
    }

    console.log(`\n\n✅ Fixed ${fixedCount} pets`);
    console.log('✅ All done!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

fixTemperamentData();
