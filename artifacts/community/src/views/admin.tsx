"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  useGetMe, getGetMeQueryKey,
  useGetAdminOverview, getGetAdminOverviewQueryKey,
  useListFlags, getListFlagsQueryKey,
  useResolveFlag,
  useListUsersAdmin, getListUsersAdminQueryKey,
  useListTransactionsAdmin, getListTransactionsAdminQueryKey,
  useListCategories,
  useCreateCategoryAdmin,
  useUpdateCategoryAdmin,
  useDeleteCategoryAdmin,
  useListTags, getListTagsQueryKey,
  useCreateTagAdmin,
  useUpdateTagAdmin,
  useDeleteTagAdmin,
  useListSponsorInquiriesAdmin, getListSponsorInquiriesAdminQueryKey,
  useUpdateSponsorInquiryAdmin
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { ShieldAlert, Users, Flag, Activity, CreditCard, Ban, Trash2, Edit2, Plus, Grid2X2, Layers, Megaphone, Mail } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function Admin() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const setLocation = (to: string) => router.push(to);
  const tabParam = searchParams.get("tab");
  const initialTab = ["flags", "users", "taxonomy", "sponsors", "transactions"].includes(
    tabParam ?? "",
  )
    ? tabParam!
    : "flags";
  const queryClient = useQueryClient();

  const { data: me, isLoading: meLoading } = useGetMe({ query: { queryKey: getGetMeQueryKey(), retry: false } });

  const { data: overview, isLoading: overviewLoading } = useGetAdminOverview({
    query: { enabled: (me?.role === 'admin' || me?.role === 'platform_owner'), queryKey: getGetAdminOverviewQueryKey() }
  });

  const { data: flags } = useListFlags({
    query: { enabled: (me?.role === 'admin' || me?.role === 'platform_owner'), queryKey: getListFlagsQueryKey() }
  });

  const { data: users } = useListUsersAdmin(
    { q: '' },
    { query: { enabled: (me?.role === 'admin' || me?.role === 'platform_owner'), queryKey: getListUsersAdminQueryKey({ q: '' }) } }
  );

  const resolveFlag = useResolveFlag();

  const [sponsorStatusFilter, setSponsorStatusFilter] = useState<'all' | 'new' | 'contacted' | 'closed'>('all');
  const sponsorParams = sponsorStatusFilter === 'all' ? undefined : { status: sponsorStatusFilter };
  const { data: sponsorInquiries } = useListSponsorInquiriesAdmin(sponsorParams, {
    query: { enabled: (me?.role === 'admin' || me?.role === 'platform_owner'), queryKey: getListSponsorInquiriesAdminQueryKey(sponsorParams) }
  });

  const updateSponsorInquiry = useUpdateSponsorInquiryAdmin();

  if (meLoading || overviewLoading) {
    return <div className="p-8"><Skeleton className="h-64 w-full rounded-2xl" /></div>;
  }

  if (!me || (me.role !== 'admin' && me.role !== 'platform_owner')) {
    setLocation("/");
    return null;
  }

  const handleSponsorStatusChange = (id: number, status: 'new' | 'contacted' | 'closed') => {
    updateSponsorInquiry.mutate({ id, data: { status } }, {
      onSuccess: () => {
        toast.success(status === 'new' ? "Marked as new" : status === 'contacted' ? "Marked as contacted" : "Lead closed");
        queryClient.invalidateQueries({ queryKey: ['/api/admin/sponsor-inquiries'] });
      },
      onError: () => toast.error("Could not update the lead status")
    });
  };

  const handleResolveFlag = (flagId: number, action: 'dismiss' | 'remove_content') => {
    resolveFlag.mutate({ id: flagId, data: { action } }, {
      onSuccess: () => {
        toast.success(action === 'dismiss' ? "Flag dismissed" : "Content removed");
        queryClient.invalidateQueries({ queryKey: getListFlagsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetAdminOverviewQueryKey() });
      }
    });
  };

  return (
    <>
<div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 bg-primary text-primary-foreground rounded-2xl shadow-sm">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground">Control Panel</h1>
            <p className="text-muted-foreground">Manage reports, users, categories, and community health.</p>
          </div>
        </div>

        {/* Overview Cards */}
        {overview && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="p-5 rounded-2xl border bg-card shadow-sm flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                <Flag className="h-4 w-4" /> Open Flags
              </div>
              <div className="text-3xl font-bold font-serif text-destructive">{overview.openFlagCount}</div>
            </div>
            <div className="p-5 rounded-2xl border bg-card shadow-sm flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                <Activity className="h-4 w-4" /> Activity Today
              </div>
              <div className="text-3xl font-bold font-serif text-primary">{overview.questionsToday + overview.answersToday}</div>
            </div>
            <div className="p-5 rounded-2xl border bg-card shadow-sm flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                <Users className="h-4 w-4" /> New Users
              </div>
              <div className="text-3xl font-bold font-serif">{overview.newUsersToday}</div>
            </div>
            <div className="p-5 rounded-2xl border bg-card shadow-sm flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                <ShieldAlert className="h-4 w-4" /> Total Users
              </div>
              <div className="text-3xl font-bold font-serif">{overview.userCount}</div>
            </div>
          </div>
        )}

        <Tabs defaultValue={initialTab}>
          <TabsList className="bg-muted/50 p-1 mb-6 rounded-full flex-wrap h-auto justify-start">
            <TabsTrigger value="flags" className="rounded-full px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm gap-2">
              <Flag className="h-4 w-4" /> Reports {overview?.openFlagCount ? <Badge variant="destructive" className="ml-1 px-1.5 py-0 h-5 rounded-full">{overview.openFlagCount}</Badge> : ''}
            </TabsTrigger>
            <TabsTrigger value="users" className="rounded-full px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm gap-2">
              <Users className="h-4 w-4" /> Users
            </TabsTrigger>
            <TabsTrigger value="taxonomy" className="rounded-full px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm gap-2">
              <Grid2X2 className="h-4 w-4" /> Categories & Tags
            </TabsTrigger>
            <TabsTrigger value="sponsors" className="rounded-full px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm gap-2">
              <Megaphone className="h-4 w-4" /> Sponsors {sponsorInquiries?.length ? <Badge variant="secondary" className="ml-1 px-1.5 py-0 h-5 rounded-full">{sponsorInquiries.length}</Badge> : ''}
            </TabsTrigger>
            <TabsTrigger value="transactions" className="rounded-full px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm gap-2">
              <CreditCard className="h-4 w-4" /> Financials
            </TabsTrigger>
          </TabsList>

          <TabsContent value="flags" className="space-y-4">
            {flags && flags.length > 0 ? (
              flags.map(flag => (
                <div key={flag.id} className="p-5 rounded-2xl border bg-card flex flex-col md:flex-row gap-6 items-start shadow-sm">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="uppercase font-bold tracking-wider rounded-full">{flag.contentType}</Badge>
                      <span className="text-xs text-muted-foreground">Reported by <span className="font-medium">{flag.reporter.username}</span> • {formatDistanceToNow(new Date(flag.createdAt), { addSuffix: true })}</span>
                    </div>
                    <p className="font-medium text-destructive">{flag.reason}</p>
                    <div className="p-3 bg-muted/50 rounded-xl text-sm font-mono border mt-2">
                      {flag.contentPreview}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0 w-full md:w-auto">
                    <Button 
                      variant="destructive" 
                      onClick={() => handleResolveFlag(flag.id, 'remove_content')}
                      disabled={resolveFlag.isPending}
                      className="rounded-full shadow-sm"
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Remove Content
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleResolveFlag(flag.id, 'dismiss')}
                      disabled={resolveFlag.isPending}
                      className="rounded-full"
                    >
                      Dismiss Report
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-muted/20 border border-dashed rounded-3xl text-muted-foreground">
                <Flag className="h-12 w-12 opacity-20 mx-auto mb-4" />
                No pending reports. Great job!
              </div>
            )}
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            {users && users.length > 0 && (
              <div className="rounded-3xl border bg-card overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 text-muted-foreground font-medium uppercase tracking-wider text-xs">
                      <tr>
                        <th className="px-6 py-4">User</th>
                        <th className="px-6 py-4">Role</th>
                        <th className="px-6 py-4">Reputation</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {users.map(u => (
                        <tr key={u.id} className="hover:bg-muted/20 transition-colors">
                          <td className="px-6 py-4 font-medium">{u.displayName} <span className="text-muted-foreground font-normal ml-1">@{u.username}</span></td>
                          <td className="px-6 py-4"><Badge variant="outline" className="rounded-full">{u.role}</Badge></td>
                          <td className="px-6 py-4">{u.reputation}</td>
                          <td className="px-6 py-4">
                            {u.isSuspended ? <Badge variant="destructive" className="rounded-full">Suspended</Badge> : <Badge variant="secondary" className="bg-green-500/10 text-green-600 rounded-full">Active</Badge>}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 rounded-full">
                              <Ban className="h-4 w-4 mr-2" /> {u.isSuspended ? 'Unsuspend' : 'Suspend'}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="taxonomy" className="space-y-8">
            <TaxonomyManager />
          </TabsContent>

          <TabsContent value="sponsors" className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              {(['all', 'new', 'contacted', 'closed'] as const).map(f => (
                <Button
                  key={f}
                  size="sm"
                  variant={sponsorStatusFilter === f ? 'default' : 'outline'}
                  className="rounded-full capitalize"
                  onClick={() => setSponsorStatusFilter(f)}
                >
                  {f === 'all' ? 'All' : f}
                </Button>
              ))}
            </div>
            {sponsorInquiries && sponsorInquiries.length > 0 ? (
              sponsorInquiries.map(inquiry => (
                <div key={inquiry.id} className={`p-5 rounded-2xl border bg-card shadow-sm space-y-3 ${inquiry.status === 'closed' ? 'opacity-60' : ''}`}>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-serif font-bold text-lg text-foreground">{inquiry.company}</span>
                    <Badge variant="outline" className="rounded-full uppercase tracking-wider font-bold">
                      {{ under_1k: "< $1k", "1k_5k": "$1k–5k", "5k_20k": "$5k–20k", over_20k: "> $20k", undecided: "Undecided" }[inquiry.budgetRange] ?? inquiry.budgetRange}
                    </Badge>
                    <Badge
                      variant={inquiry.status === 'new' ? 'default' : 'secondary'}
                      className={`rounded-full uppercase tracking-wider font-bold ${inquiry.status === 'contacted' ? 'bg-amber-500/15 text-amber-600' : ''}`}
                    >
                      {inquiry.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground ml-auto rtl:ml-0 rtl:mr-auto">{formatDistanceToNow(new Date(inquiry.createdAt), { addSuffix: true })}</span>
                  </div>
                  <div className="text-sm text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span className="font-medium text-foreground">{inquiry.contactName}</span>
                    <a href={`mailto:${inquiry.email}`} className="inline-flex items-center gap-1 text-primary hover:underline" dir="ltr">
                      <Mail className="h-3.5 w-3.5" /> {inquiry.email}
                    </a>
                  </div>
                  <p className="text-sm text-foreground/90 bg-muted/50 rounded-xl p-3 border whitespace-pre-wrap">{inquiry.message}</p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {inquiry.status !== 'contacted' && (
                      <Button size="sm" variant="outline" className="rounded-full" disabled={updateSponsorInquiry.isPending}
                        onClick={() => handleSponsorStatusChange(inquiry.id, 'contacted')}>
                        Mark Contacted
                      </Button>
                    )}
                    {inquiry.status !== 'closed' && (
                      <Button size="sm" variant="outline" className="rounded-full text-muted-foreground" disabled={updateSponsorInquiry.isPending}
                        onClick={() => handleSponsorStatusChange(inquiry.id, 'closed')}>
                        Close Lead
                      </Button>
                    )}
                    {inquiry.status !== 'new' && (
                      <Button size="sm" variant="ghost" className="rounded-full text-muted-foreground" disabled={updateSponsorInquiry.isPending}
                        onClick={() => handleSponsorStatusChange(inquiry.id, 'new')}>
                        Reopen as New
                      </Button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-muted/20 border border-dashed rounded-3xl text-muted-foreground">
                <Megaphone className="h-12 w-12 opacity-20 mx-auto mb-4" />
                {sponsorStatusFilter === 'all' ? 'No sponsor inquiries yet.' : `No ${sponsorStatusFilter} inquiries.`}
              </div>
            )}
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            <div className="text-center py-20 bg-muted/20 border border-dashed rounded-3xl text-muted-foreground">
              <CreditCard className="h-12 w-12 opacity-20 mx-auto mb-4" />
              Transactions overview coming soon.
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

function TaxonomyManager() {
  const queryClient = useQueryClient();
  const { data: categories } = useListCategories();
  const { data: tags } = useListTags({ query: { queryKey: getListTagsQueryKey() } });

  const createCategory = useCreateCategoryAdmin();
  const updateCategory = useUpdateCategoryAdmin();
  const deleteCategory = useDeleteCategoryAdmin();

  const createTag = useCreateTagAdmin();
  const updateTag = useUpdateTagAdmin();
  const deleteTag = useDeleteTagAdmin();

  const [categoryDialog, setCategoryDialog] = useState<{ open: boolean, mode: 'create'|'edit', id?: number, name: string, description: string }>({ open: false, mode: 'create', name: "", description: "" });
  const [tagDialog, setTagDialog] = useState<{ open: boolean, mode: 'create'|'edit', id?: number, name: string, description: string }>({ open: false, mode: 'create', name: "", description: "" });

  const handleSaveCategory = () => {
    if (categoryDialog.mode === 'create') {
      createCategory.mutate({ data: { name: categoryDialog.name, description: categoryDialog.description } }, {
        onSuccess: () => {
          toast.success("Category created");
          setCategoryDialog({ open: false, mode: 'create', name: "", description: "" });
          queryClient.invalidateQueries();
        }
      });
    } else if (categoryDialog.id) {
      updateCategory.mutate({ id: categoryDialog.id, data: { name: categoryDialog.name, description: categoryDialog.description } }, {
        onSuccess: () => {
          toast.success("Category updated");
          setCategoryDialog({ open: false, mode: 'create', name: "", description: "" });
          queryClient.invalidateQueries();
        }
      });
    }
  };

  const handleDeleteCategory = (id: number) => {
    if (confirm("Are you sure? Questions in this category will become uncategorized.")) {
      deleteCategory.mutate({ id }, {
        onSuccess: () => {
          toast.success("Category deleted");
          queryClient.invalidateQueries();
        }
      });
    }
  };

  const handleSaveTag = () => {
    if (tagDialog.mode === 'create') {
      createTag.mutate({ data: { name: tagDialog.name, description: tagDialog.description } }, {
        onSuccess: () => {
          toast.success("Tag created");
          setTagDialog({ open: false, mode: 'create', name: "", description: "" });
          queryClient.invalidateQueries({ queryKey: getListTagsQueryKey() });
        }
      });
    } else if (tagDialog.id) {
      updateTag.mutate({ id: tagDialog.id, data: { name: tagDialog.name, description: tagDialog.description } }, {
        onSuccess: () => {
          toast.success("Tag updated");
          setTagDialog({ open: false, mode: 'create', name: "", description: "" });
          queryClient.invalidateQueries({ queryKey: getListTagsQueryKey() });
        }
      });
    }
  };

  const handleDeleteTag = (id: number) => {
    if (confirm("Are you sure? This tag will be removed from all questions.")) {
      deleteTag.mutate({ id }, {
        onSuccess: () => {
          toast.success("Tag deleted");
          queryClient.invalidateQueries({ queryKey: getListTagsQueryKey() });
        }
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Categories */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-serif font-bold flex items-center gap-2">
            <Grid2X2 className="h-5 w-5 text-primary" /> Categories
          </h3>
          <Button size="sm" onClick={() => setCategoryDialog({ open: true, mode: 'create', name: "", description: "" })} className="rounded-full">
            <Plus className="h-4 w-4 mr-1" /> New Category
          </Button>
        </div>
        <div className="rounded-3xl border bg-card overflow-hidden shadow-sm">
          <div className="divide-y divide-border">
            {categories?.map(c => (
              <div key={c.id} className="p-4 flex items-center justify-between gap-4 hover:bg-muted/20 transition-colors">
                <div className="min-w-0">
                  <div className="font-semibold text-foreground truncate">{c.name}</div>
                  <div className="text-sm text-muted-foreground font-mono truncate">{c.slug} • {c.questionCount} questions</div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setCategoryDialog({ open: true, mode: 'edit', id: c.id, name: c.name, description: c.description || "" })}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDeleteCategory(c.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-serif font-bold flex items-center gap-2">
            <Layers className="h-5 w-5 text-accent" /> Tags
          </h3>
          <Button size="sm" onClick={() => setTagDialog({ open: true, mode: 'create', name: "", description: "" })} className="rounded-full bg-accent hover:bg-accent/90 text-accent-foreground">
            <Plus className="h-4 w-4 mr-1" /> New Tag
          </Button>
        </div>
        <div className="rounded-3xl border bg-card overflow-hidden shadow-sm">
          <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
            {tags?.map(t => (
              <div key={t.id} className="p-4 flex items-center justify-between gap-4 hover:bg-muted/20 transition-colors">
                <div className="min-w-0">
                  <div className="font-semibold text-foreground truncate">{t.name}</div>
                  <div className="text-sm text-muted-foreground font-mono truncate">{t.slug} • {t.questionCount} questions</div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setTagDialog({ open: true, mode: 'edit', id: t.id, name: t.name, description: t.description || "" })}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDeleteTag(t.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={categoryDialog.open} onOpenChange={open => !open && setCategoryDialog(prev => ({...prev, open}))}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>{categoryDialog.mode === 'create' ? 'New Category' : 'Edit Category'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={categoryDialog.name} onChange={e => setCategoryDialog(prev => ({...prev, name: e.target.value}))} placeholder="Category Name" className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input value={categoryDialog.description} onChange={e => setCategoryDialog(prev => ({...prev, description: e.target.value}))} placeholder="Optional description" className="rounded-xl" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded-full" onClick={() => setCategoryDialog(prev => ({...prev, open: false}))}>Cancel</Button>
            <Button className="rounded-full" onClick={handleSaveCategory} disabled={!categoryDialog.name.trim() || createCategory.isPending || updateCategory.isPending}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={tagDialog.open} onOpenChange={open => !open && setTagDialog(prev => ({...prev, open}))}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>{tagDialog.mode === 'create' ? 'New Tag' : 'Edit Tag'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={tagDialog.name} onChange={e => setTagDialog(prev => ({...prev, name: e.target.value}))} placeholder="Tag Name" className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input value={tagDialog.description} onChange={e => setTagDialog(prev => ({...prev, description: e.target.value}))} placeholder="Optional description" className="rounded-xl" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded-full" onClick={() => setTagDialog(prev => ({...prev, open: false}))}>Cancel</Button>
            <Button className="rounded-full bg-accent hover:bg-accent/90 text-accent-foreground" onClick={handleSaveTag} disabled={!tagDialog.name.trim() || createTag.isPending || updateTag.isPending}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
