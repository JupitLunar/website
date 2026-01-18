const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkContent() {
    console.log('Checking Content...');

    // Check Article Schema
    const { data: article, error: articleError } = await supabase
        .from('articles')
        .select('*')
        .limit(1)
        .single();

    if (articleError) console.error('Error fetching article:', articleError);
    if (article) {
        console.log('Article Columns:', Object.keys(article));
        console.log('Sample Article:', article.slug, article.title);
    }
}

checkContent();
