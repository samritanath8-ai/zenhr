public function up(): void
{
    Schema::create('asset_documents', function (Blueprint $table) {
        $table->id();
        $table->foreignId('asset_id')->constrained()->onDelete('cascade');
        $table->foreignId('uploaded_by')->nullable()->constrained('users')->nullOnDelete();
        $table->string('name');
        $table->string('path');
        $table->string('mime_type')->nullable();
        $table->unsignedBigInteger('size')->nullable();
        $table->timestamps();
    });
}

public function down(): void
{
    Schema::dropIfExists('asset_documents');
}