import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeWorkbook,fetchTableauWorkbooks} from '../api/tableau.js';
test('validates workbook metadata and generates safe Tableau URLs',()=>{
  const viz=normalizeWorkbook({title:'Orders',workbookRepoUrl:'Orders',defaultViewRepoUrl:'Orders/sheets/Overview',viewCount:10});
  assert.equal(viz.url,'https://public.tableau.com/app/profile/john.torres1912/viz/Orders/Overview');
  assert.equal(viz.views,10);
  assert.equal(normalizeWorkbook({...viz,showInProfile:false}),null);
  assert.equal(normalizeWorkbook({title:'Bad',workbookRepoUrl:'http:',defaultViewRepoUrl:'Bad/sheets/View'}),null);
});
test('deduplicates and filters published workbook list',async()=>{
  const request=async()=>({ok:true,json:async()=>[
    {title:'Orders',workbookRepoUrl:'Orders',defaultViewRepoUrl:'Orders/sheets/Overview'},
    {title:'Orders',workbookRepoUrl:'Orders',defaultViewRepoUrl:'Orders/sheets/Overview'},
    {title:'Hidden',workbookRepoUrl:'Hidden',defaultViewRepoUrl:'Hidden/sheets/View',showInProfile:false}
  ]});
  assert.equal((await fetchTableauWorkbooks(request)).length,1);
});
test('does not present upstream failure as empty data',async()=>{
  await assert.rejects(fetchTableauWorkbooks(async()=>({ok:false,status:503})),/503/);
});
